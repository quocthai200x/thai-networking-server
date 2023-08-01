
const Company = require("../model/companies");
const jobDictionary = require("../../config/dictionary/job")
var Job = require("../model/jobs")
const { faker } = require('@faker-js/faker');



const fakerService = {


    fakeJobs: async () => {

        let amountCompany = 1000;
        let amountJobEachCompany = 2;
        let arrayJob = [];
        try {
            let level = _randomProperty(jobDictionary.level)
            const provinces = ["Thành phố Hà Nội", "Thành phố Hồ Chí Minh", "Tỉnh Cao Bằng", "Tỉnh Bắc Kạn", 'Tỉnh Điện Biên'];
            const districts = ['Quận Ba Đình', 'Quận Long Biên', 'Quận Tây Hồ', 'Quận Hoàn Kiếm', 'Quận Hai Bà Trưng'];
            const wards = ['Phường Bách Khoa', 'Phường Phúc Xá', 'Phường Trúc Bạch', 'Phường Vĩnh Phúc', "Phường Bách Khoa"]
            // ------------------

    
            let companyList = await Company.find().limit(amountCompany);
            companyList = companyList.map(item => item._id)
            let status = jobDictionary.status.show
            // for loop từng công ty
            companyList.forEach(companyID=>{
                // mỗi company for số lần job muốn tạo
                for (let index = 0; index < amountJobEachCompany; index++) {
                    const random2 = Math.floor(Math.random() * provinces.length);
                    const salaryRate = _randomSalaryRate();
                    const randomKeyword = _randomSkill();
                    let jobInfo = {
                        name: faker.person.jobTitle(),
                        level: level,
                        type: _randomArrayWorkingArea(),
                        workingAddress: {
                            address: "Số 15 ngõ 84 phố Võ Thị Sáu",
                            district: districts[random2],
                            ward: wards[random2],
                            province: provinces[random2],
                            latitude: faker.location.latitude(),
                            longitude: faker.location.longitude(),
                        },
                        desc: faker.lorem.words(200),
                        requirement: faker.lorem.words(200),
                        salaryRate: salaryRate,
                        keyword: randomKeyword,
                        languageRecruitment: ["Tiếng Việt", "Tiếng Anh"],
                        emailReceive: [],
                        outdate: faker.date.between({from: '2023-08-18T00:00:00.000Z', to: '2023-10-25T00:00:00.000Z'}),
                        benefits: [{
                            svg: "family_restroom",
                            desc: "Lương thưởng tháng thứ 13 hấp dẫn người ứng viên nên là hãy ứng tuyển đi",
                            label: "Gia đình",
                        },],
                        recruitmentProcess: [
                            {
                                name: "Vòng phỏng vấn HR",
                                value: 0,
                               
                            },
                            {
                                name: "Vòng phỏng vấn CTO",
                                value: 1,
                               
                            }
                        ],
                        score: Math.floor(Math.random() * 5),
                        targetScore: 10
        
        
                    }
                    let jobObject = {
                        info: jobInfo,
                        status,
                        viewed: 0,
                        companyId: companyID,
                        indexRecruiter: 0,
                        recruiterAttached: [],
                    }
                    arrayJob.push(jobObject)
                    
                }
            })
            let result = await Job.insertMany(arrayJob)
            if(result){
                return true;
            }else{
                return false;
            }
            // return arrayJob;
        } catch (error) {
            throw new Error(error)
        };
        function _randomSkill() {
            let array = [];
            for (let index = 0; index < 4; index++) {
                let skill = jobDictionary.skills[Math.floor(Math.random() * jobDictionary.skills.length)];
                while (array.includes(skill)) {
                    skill = jobDictionary.skills[Math.floor(Math.random() * jobDictionary.skills.length)];
                }
                array.push(skill)
            }
            return array
        }

        function _randomKeyword() {
            let array = [];
            let randomSize = Math.floor(Math.random() * 6) + 4;
            for (let index = 0; index < randomSize; index++) {
                array.push(faker.name.jobArea());
            }
            return array;
        }
        function _randomArrayWorkingArea() {
            let randomSize = Math.floor(Math.random() * 4) + 2;
            let array = [];
            for (let index = 0; index < randomSize; index++) {
                const randomJobField = Math.floor(Math.random() * jobDictionary.type.length);
                const randomJobName = Math.floor(Math.random() * jobDictionary.type[randomJobField].workings.length);
                const getJobField = jobDictionary.type[randomJobField].field;
                const getJobName = jobDictionary.type[randomJobField].workings[randomJobName];
                array.push({
                    field: getJobField,
                    name: getJobName,
                })
            }
            return array
        }
        function _randomSalaryRate() {
            let random = Math.floor(Math.random() * 2000);
            let random2 = Math.floor(Math.random() * 4000);
            let salaryRate = {
                isVisible: Math.random() < 0.5,
                from: random,
                to: random2 + random
            };
            return salaryRate;

        }
        function _randomProperty(obj) {
            let keys = Object.keys(obj);
            return obj[keys[keys.length * Math.random() << 0]];
        }
    },
}

module.exports = fakerService;