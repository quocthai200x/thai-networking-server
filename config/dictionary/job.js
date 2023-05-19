const jobDictionary = {
    status:{
        show:{
            name: "Đang hiển thị",
            value :0
        },
        draft:{
            name: "Nháp",
            value :1
        },
        hidden:{
            name: "Đang ẩn",
            value :2
        },
    },
    level:{
        intern: {
            name: "Thực tập sinh",
            level: 0,
        },
        graduated: {
            name: "Đã tốt nghiệp",
            level: 1,
        },
        staff: {
            name: "Nhân viên",
            level: 2,
        },
        manager: {
            name: "Trưởng phòng",
            level: 3,
        },
        director: {
            name:"Giám đốc hoặc chức vụ cao hơn",
            level: 4,
        }
    },
    type:[
        {
            field: "Dịch vụ tài chính",
            workings: ["Bảo hiểm", "Chứng khoán","Kiểm toán", "Tài chính/Đầu tư", "Ngân hàng"]
        },
        {
            field: "Truyền thông",
            workings: ["In ấn/Xuất bản", "Internet/Online media", "Mỹ thuật/Nghệ thuật/Thiết kế",
                    "Quảng cáo/Khuyến mãi/Đối ngoại", "Truyền thông/Truyền hình/Báo chí", "Viễn Thông"
                ]
        },
        {
            field:"Hàng tiêu dùng & Bán lẻ",
            workings :["Bán lẻ/Bán sỉ", "Hàng cao cấp","Hàng gia dụng", "Hàng tiêu dùng", "Thời trang", "Thực phẩm & đồ uống"]
        },
        {
            field: "Khách sạn & du lịch",
            workings: ["Hàng không/Du lịch", "Khách sạn/Nhà hàng"]
        },
        {
            field:"Kỹ thuật - Công nghệ",
            workings: ["IT - Phần cứng/Mạng", "IT - Phần mềm", "Tài chính công nghệ", "Thương mại điện tử"]
        },
        {
            field: "Xây Dựng",
            workings: ["Bất động sản", "Kiến trúc/Thiết kế nội thất", "Xây dựng"]
        },
        {
            field: "Vận Tải",
            workings: ["Hàng hải", "Kho vận", "Vận chuyển/Giao nhận"],
        },
        {
            field: "Dịch vụ",
            workings: ["Giáo dục/Đào tạo", "Phi chính phủ/Phi lợi nhuận", "Tư vấn"]
        },
        {
            field: "Giao dịch khách hàng",
            workings: ["Bán hàng", "Bán hàng kỹ thuật", "Dịch vụ khách hàng", "Marketing"]
        },
        {
            field: "Bộ phận hỗ trợ",
            workings: ["Biên phiên dịch", "Hành chính/Thư ký", "Kế toán", "Nhân sự", "Pháp lý"]
        },
        {
            field: "Kỹ thuật",
            workings: ["Cơ khí", "Hóa học/Hóa sinh", "Môi trường/Xử lý rác thải", "Điện lạnh/Nhiệt lạnh", "Điện/Điện tử"]
        },
        {
            field: "Y tế",
            workings: ["Bác sĩ","Dược sĩ","Trình dược viên", "Y sĩ/Hộ lý", "Y tế/Chăm sóc sức khỏe"]
        },
        {
            field: "Sản xuất",
            workings: ["Công nghệ cao", "Dầu khí","Dệt may/Da giày","Dược phẩm/Công nghệ sinh học","Nông nghiệp/Lâm nghiệp", "Sản xuất công nghiệp"
                    ,"Tự động hóa/Ô tô", "Địa chất/Khoáng sản"
                    ]
        },
        {
            field: "Hỗ trợ sản xuất",
            workings: ["An toàn lao động", "Bảo trì/Sửa chữa", "Hoạch định/Dự án","QA/QC", "Sản xuất","Thu mua/Vật tư/Cung vận","Xuất nhập khẩu"]
        },
        {
            field: "Đối tượng",
            workings: ["Cấp quản lý điều hành", "Khác", "Mới tốt nghiệp", "Người nước ngoài/Việt kiều", "Oversea Jobs", "Thời vụ/Hợp đồng ngắn hạn"]
        },
    ],
    salary:[500, 1000, 2000, 5000, 10000],
    languague:["Bất kì", "Tiếng Anh", "Tiếng Việt", "Tiếng Trung", "Tiếng Ấn Độ"]


}

module.exports = jobDictionary