import {User} from './models'


const testFunc = async() => {
    const testUser = new User({
        username: 'kek',
        password: 'kek'
    });
    console.log(testUser);
    await testUser.save();
};


testFunc();