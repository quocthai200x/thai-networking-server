const applicationDictionary = {
    byUser: 0,
    byCompany: 1,
    created:{
        isUser: (byWho) =>{
            return byWho == 0
        },
        isCompany: (byWho) =>{
            return byWho == 1
        }
    },
    status: {
        turnIn: {
            name: "Nhận hồ sơ",
            value: 0
        },
        approve: {
            name: "Duyệt hồ sơ",
            value: 1,
        },
        interview: {
            name: "Interview",
            value: 2,
        },
        offer: {
            name: "Đề nghị nhận việc",
            value: 3
        },
        getHired:{
            name: "Đã tuyển",
            value: 4,
        },
        notQualify:{
            name: "Không đạt",
            value: 5,
        },
        rejectByUser:{
            name:"Ứng viên từ chối",
            value: 6
        }
    }
}

module.exports = applicationDictionary