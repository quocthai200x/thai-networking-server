var Company = require("../model/companies")

var mongoose = require("../../infrastructure/db");

const CompanyService = {
    get: async (companyName) => {
        const company = await Company.findOne({ 'info.name': companyName }).select({ info: 1 });
        if (company) {
            return company
        } else {
            throw new Error("Not found")
        }

    },
    update: async (data, companyId) => {
        const company = await Company.findById(companyId);
        if (company) {
            data.name = company.info.name;
            company.info = data;
            const updatedCompany = await company.save()
            if (updatedCompany) {
                return updatedCompany
            }
            else {
                throw new Error("Error: update fail")
            }
        } else {
            throw new Error("Not found")
        }
    },
    updateModel: async () => {
        Company.updateMany({}, {
            $set: {
                "info.size": {
                    label: "50-100",
                    value: 4
                },
            }
        }, function (err, affected) {
            if (err) {
                throw new Error("Some thing wrong")
            } else {
                console.log('Updated %d documents', affected);
                return affected
            }
        });
    }
}

module.exports = CompanyService;