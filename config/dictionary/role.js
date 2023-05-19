const roleDictionary = {
    user: 0,
    admin: 1,
    employee: 2,
    isAdmin: (role) => {
        return role == 1;
    },
    isUser: (role) => {
        return role == 0;
    },
    isEmployee: (role) => {
        return role == 2;
    }

}

module.exports = roleDictionary