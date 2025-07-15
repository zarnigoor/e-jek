import Application from '../models/Application.js';

export const createApplication = async (data) => {
  const { userId, mutaxassislik, muammoTavsifi, navbatRaqami } = data;
  const application = new Application({
    userId,
    mutaxassislik,
    muammoTavsifi,
    navbatRaqami,
  });
  return await application.save();
};

export const getApplicationsByUserId = async (userId, query) => {
  const { filter } = query;
  let sort = {};
  if (filter === 'new') {
    sort = { createdAt: -1 };
  } else if (filter === 'old') {
    sort = { createdAt: 1 };
  }
  return await Application.find({ userId }).sort(sort);
};

export const updateApplicationStatus = async (id, status) => {
  return await Application.findByIdAndUpdate(id, { status }, { new: true });
};
