export default defineNuxtPlugin(() => {
  const provinces = [
    "Hà Giang",
    "Cao Bằng",
    "Lạng Sơn",
    "Quảng Ninh",
    "Lào Cai",
    "Điện Biên",
    "Lai Châu",
    "Sơn La",
    "Yên Bái",
    "Thái Nguyên",
    "Phú Thọ",
    "Bắc Kạn",
    "Bắc Giang",
    "Bắc Ninh",
    "Hà Nội",
    "Vĩnh Phúc",
    "Hải Dương",
    "Hải Phòng",
    "Hưng Yên",
    "Nam Định",
    "Thái Bình",
    "Ninh Bình",
    "Hà Nam",
    "Thanh Hóa",
    "Nghệ An",
    "Hà Tĩnh",
    "Quảng Bình",
    "Quảng Trị",
    "Thừa Thiên Huế",
    "Đà Nẵng",
    "Quảng Nam",
    "Quảng Ngãi",
    "Bình Định",
    "Phú Yên",
    "Khánh Hòa",
    "Ninh Thuận",
    "Bình Thuận",
    "Kon Tum",
    "Gia Lai",
    "Đắk Lắk",
    "Đắk Nông",
    "Lâm Đồng",
    "Bình Phước",
    "Bà Rịa - Vũng Tàu",
    "Đồng Nai",
    "Tây Ninh",
    "Bình Dương",
    "Hồ Chí Minh",
    "Long An",
    "Tiền Giang",
    "Bến Tre",
    "Đồng Tháp",
    "An Giang",
    "Cần Thơ",
    "Hậu Giang",
    "Kiên Giang",
    "Sóc Trăng",
    "Bạc Liêu",
    "Cà Mau",
  ];
  function extractProvince(address) {
    const cleanAddress = address.normalize("NFC").toLowerCase(); // Chuẩn hóa chuỗi

    // Tạo một mảng các tỉnh thành xuất hiện trong địa chỉ
    let matchedProvince = null;

    // Duyệt qua các tỉnh thành để tìm xem tỉnh nào xuất hiện trong địa chỉ
    for (const province of provinces) {
      const provinceLower = province.toLowerCase();
      if (cleanAddress.includes(provinceLower)) {
        matchedProvince = province; // Cập nhật tỉnh tìm được
      }
    }

    return matchedProvince;
  }
  return {
    provide: {
      extractProvince,
    },
  };
});
