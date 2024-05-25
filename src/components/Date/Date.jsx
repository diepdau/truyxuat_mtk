// const DateConverter = ({ originalDate }) => {
//   // Chuyển đổi từ ISO 8601 sang Date object
//   const dateObject = new Date(originalDate);

//   // Lấy ngày, tháng, năm từ Date object
//   const day = dateObject.getDate().toString().padStart(2, "0");
//   const month = (dateObject.getMonth() + 1).toString().padStart(2, "0"); // Lưu ý: tháng bắt đầu từ 0
//   const year = dateObject.getFullYear();

//   // // Lấy giờ và phút từ Date object
//   // let hour = dateObject.getHours();
//   // const minute = dateObject.getMinutes().toString().padStart(2, "0");

//   // // Định dạng giờ sang 12-giờ và thêm 'AM' hoặc 'PM'
//   // const ampm = hour >= 12 ? "PM" : "AM";
//   // hour = hour % 12;
//   // hour = hour ? hour : 12; // Đổi 0 thành 12 nếu là giờ 0 (12:00 AM)
//   // const formattedTime = `${hour}:${minute} ${ampm}`;

//   // Tạo chuỗi ngày tháng mới
//   const formattedDate = `${month}/${day}/${year}`;
//   return formattedDate;
// };
// export default DateConverter;
export const DateConverter = (originalDate) => {
  // Kiểm tra xem originalDate có tồn tại không
  if (!originalDate) {
    return "Invalid Date";
  }

  // Tách ngày tháng từ originalDate
  const dateParts = originalDate.split('T')[0].split('-');

  // Lấy tháng, ngày và năm từ các thành phần đã tách
  const year = dateParts[0];
  const month = dateParts[1];
  let day = dateParts[2];

  // Chuyển đổi ngày thành số và thêm một ngày
  day = parseInt(day, 10) + 1;

  // Tạo một đối tượng Date mới với ngày đã được thay đổi
  const nextDayDate = new Date(`${year}-${month}-${day}`);

  // Lấy tháng, ngày và năm từ đối tượng Date mới
  const nextDay = nextDayDate.getDate();
  const nextMonth = nextDayDate.getMonth() + 1; // Tháng bắt đầu từ 0, nên cần cộng thêm 1
  const nextYear = nextDayDate.getFullYear();

  // Tạo chuỗi tháng/ngày/năm mới
  const formattedDate = `${nextMonth}/${nextDay}/${nextYear}`;

  return formattedDate;
};
