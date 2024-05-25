export const calculateAgeInMonths = (birthDate) => {
  const currentDate = new Date();
  const birthDateObj = new Date(birthDate);

  let months = (currentDate.getFullYear() - birthDateObj.getFullYear()) * 12;
  months -= birthDateObj.getMonth();
  months += currentDate.getMonth();

  return months <= 0 ? 0 : months;
};
