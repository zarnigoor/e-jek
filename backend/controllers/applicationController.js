import asyncHandler from 'express-async-handler';
import Application from '../models/Application.js';
import { validationResult } from 'express-validator';
import { createApplication, getApplicationsByUserId, updateApplicationStatus } from '../services/applicationService.js';

export const submitApplication = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { mutaxassislik, muammoTavsifi } = req.body;
  const userId = req.user.id;

  try {
    let navbatRaqami = null;
    // Only assign navbatRaqami if the status is 'ochiq' (default for new applications)
    // Find the highest existing navbatRaqami among 'ochiq' applications
    const lastOchiqApplication = await Application.findOne({ status: 'ochiq' }).sort({ navbatRaqami: -1 });
    navbatRaqami = lastOchiqApplication && lastOchiqApplication.navbatRaqami !== null ? lastOchiqApplication.navbatRaqami + 1 : 1;

    const application = await createApplication({ userId, mutaxassislik, muammoTavsifi, navbatRaqami });
    res.status(201).json(application);
  } catch (error) {
    console.error('submitApplication: Server error during creation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserApplications = async (req, res) => {
  try {
    const filter = req.query.filter;
    let applications = await Application.find({ userId: req.user.id }).sort({ createdAt: -1 });

    if (filter === 'new') {
      applications = applications.filter(app => app.status === 'ochiq');
    } else if (filter === 'old') {
      applications = applications.filter(app => app.status !== 'ochiq');
    } else if (filter === 'all') {
      // Barcha arizalar, filter qo'llanilmaydi
    }

    res.json(applications);
  } catch (error) {
    console.error(error); // Xatoni loglash
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Change application status by user or admin
// @route   PATCH /api/applications/:id/status
// @access  Private
export const changeApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const application = await Application.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Ariza topilmadi');
  }

  // Only users can change status
  if (req.user.role === 'user') {
    if (application.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Ruxsat yo\'q');
    }

    // User can only change status if the current status is 'ochiq'
    if (application.status !== 'ochiq') {
      res.status(400);
      throw new Error('Arizani faqat "ochiq" holatida o\'zgartirish mumkin');
    }

    // Allowed statuses for user
    const allowedUserStatuses = ['bajarildi', 'amalga_oshirilmadi', 'bekor_qilingan'];
    if (!allowedUserStatuses.includes(status)) {
      res.status(400);
      throw new Error("Noto\'g\'ri status. Foydalanuvchi faqat \'bajarildi\', \'amalga_oshirilmadi\' yoki \'bekor_qilingan\' holatiga o\'zgartira oladi.");
    }
  } else {
    // If not a user, deny access (e.g., admin should not change status)
    res.status(403);
    throw new Error('Sizda bu amalni bajarishga ruxsat yo\'q');
  }

  // If status changes from 'ochiq' to anything else, remove navbatRaqami
  if (application.status === 'ochiq' && status !== 'ochiq') {
    application.navbatRaqami = null;
  }

  application.status = status;
  await application.save();
  res.json(application);
});
