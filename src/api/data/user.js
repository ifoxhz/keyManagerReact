const { Sequelize,DataTypes} = require('sequelize')

const kpssql = new Sequelize('kpsdatabase', 'root', 'yongkps', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        freezeTableName: true
    }
});


async function CreateUserTable() {

    await User.sync(); // 使用 { force: true } 可以强制重新创建表
    console.log('Tables created!');
}

export const User = kpssql.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
        type: DataTypes.CHAR(11),
        allowNull: false,
      },
  })

CreateUserTable()

export async function createUser(userIns) {
    try {
        const tmpUser = await User.findOne(User.name)
        if (tmpUser){
            throw new Error("用户已经存在")
        }
        const user = await User.create(userIns);
        console.log('User created:', user.toJSON());
        return user
    } catch (error) {
      console.error('Error creating user:', error);
      return {}
    }
  }


export async function verifyUser(User){
    if (!User.name){
        return false
    }
    try {
        const tmpUser = await  User.findOne(User.name)
        if (tmpUser == null){
            return false
        }
        if (tmpUser.password === User.password){
            return true
        }
    } catch (error) {
      console.error('Error creating user:', error);
      return false
    }
}

// module.exports = {
//     User,
//     createUser,
//     verifyUser
// }
export default {User,createUser,verifyUser}
