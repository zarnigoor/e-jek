import User from '../models/User.js';
import Application from '../models/Application.js';
import { validationResult } from 'express-validator';
import { createUser, updateUserPassword, getAllUsers, searchUsers } from '../services/userService.js';
import PDFDocument from 'pdfkit';

export const getAllApplications = async (req, res) => {
  try {
    const { status, sortBy } = req.query;
    let query = {};
    let sort = { createdAt: -1 }; // Default: newest first

    if (status && status !== 'all') {
      query.status = status;
    }

    if (sortBy === 'oldest') {
      sort = { createdAt: 1 };
    }

    const applications = await Application.find(query).populate('userId', 'login name dom uy').sort(sort);
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStats = async (req, res) => {
  try {
    const daily = await Application.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } });
    const monthly = await Application.countDocuments({ createdAt: { $gte: new Date(new Date().setDate(1)) } });
    const yearly = await Application.countDocuments({ createdAt: { $gte: new Date(new Date().setMonth(0, 1)) } });
    const completed = await Application.countDocuments({ status: 'bajarildi' });
    const open = await Application.countDocuments({ status: 'ochiq' });
    const rejected = await Application.countDocuments({ status: 'amalga_oshirilmadi' });
    const cancelled = await Application.countDocuments({ status: 'bekor_qilingan' });

    res.json({ daily, monthly, yearly, completed, open, rejected, cancelled });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createUserAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { login, password, name, dom, uy } = req.body; // dom and uy are now directly from body

  try {
    const user = await createUser({ login, password, dom, uy, name });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let users;
    if (search) {
      users = await searchUsers(search);
    } else {
      users = await getAllUsers();
    }
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const changeUserPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.params.id;
  const { newPassword } = req.body;

  try {
    await updateUserPassword(userId, newPassword);
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error.message });
  }
};

export const exportApplicationsPdf = async (req, res) => {
  try {
    const applications = await Application.find().populate('userId', 'login name dom uy');

    const doc = new PDFDocument();
    let filename = 'applications.pdf';
    // Stripping special characters
    filename = encodeURIComponent(filename);
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    doc.fontSize(20).text('Mahalla Xizmatlari - Arizalar Ro\'yxati', { align: 'center' });
    doc.moveDown();

    if (applications.length === 0) {
      doc.fontSize(12).text('Hali arizalar mavjud emas.', { align: 'center' });
    } else {
      const tableHeaders = [
        'Login', 'Ism', 'Dom', 'Uy', 'Mutaxassislik', 'Holat', 'Sana', 'Muammo Tavsifi'
      ];
      const columnWidths = [60, 80, 40, 40, 80, 70, 70, 150]; // Adjust as needed

      let y = doc.y;
      let x = 50;

      // Draw headers
      doc.font('Helvetica-Bold').fontSize(10);
      tableHeaders.forEach((header, i) => {
        doc.text(header, x, y, { width: columnWidths[i], align: 'left' });
        x += columnWidths[i];
      });
      doc.moveDown();
      y = doc.y;

      // Draw rows
      doc.font('Helvetica').fontSize(9);
      applications.forEach(app => {
        x = 50;
        const rowData = [
          app.userId.login,
          app.userId.name || 'N/A',
          app.userId.dom,
          app.userId.uy,
          app.mutaxassislik,
          app.status,
          new Date(app.createdAt).toLocaleDateString(),
          app.muammoTavsifi.substring(0, 50) + (app.muammoTavsifi.length > 50 ? '...' : '')
        ];

        rowData.forEach((data, i) => {
          doc.text(String(data), x, y, { width: columnWidths[i], align: 'left' });
          x += columnWidths[i];
        });
        doc.moveDown();
        y = doc.y;
        if (y > 700) { // Check if new page is needed
          doc.addPage();
          y = 50; // Reset y for new page
          x = 50;
          doc.font('Helvetica-Bold').fontSize(10);
          tableHeaders.forEach((header, i) => {
            doc.text(header, x, y, { width: columnWidths[i], align: 'left' });
            x += columnWidths[i];
          });
          doc.moveDown();
          y = doc.y;
          doc.font('Helvetica').fontSize(9);
        }
      });
    }

    doc.end();
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ message: 'Server error during PDF export' });
  }
};

