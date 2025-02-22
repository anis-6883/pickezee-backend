import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { IUser } from "../configs/interfaces";
import Session from "./session";

interface UserCreationAttributes extends Optional<IUser, "id"> {}

class User extends Model<IUser, UserCreationAttributes> implements IUser {
  public id!: string;
  public image!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public emailVerified!: boolean;
  public dialCode!: string;
  public phone!: string;
  public phoneVerified!: boolean;
  public provider!: "email" | "phone" | "google" | "facebook";
  public status!: boolean;
  public role!: "user" | "admin";
  public gender!: "male" | "female" | "others" | "";
  public dob!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initialize(sequelize: Sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        image: {
          type: DataTypes.STRING(63),
          allowNull: true,
        },
        name: {
          type: DataTypes.STRING(127),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(127),
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        emailVerified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        dialCode: {
          type: DataTypes.STRING(7),
          allowNull: true,
        },
        phone: {
          type: DataTypes.STRING(15),
          allowNull: true,
        },
        phoneVerified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        provider: {
          type: DataTypes.ENUM("email", "phone", "google", "facebook"),
          allowNull: false,
        },
        status: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        role: {
          type: DataTypes.ENUM("user", "admin"),
          allowNull: false,
        },
        gender: {
          type: DataTypes.ENUM("male", "female", "others", ""),
          allowNull: true,
        },
        dob: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        modelName: "User",
        tableName: "users",
        sequelize,
        timestamps: true,
        indexes: [{ unique: true, fields: ["email"] }],
      }
    );
  }

  static associate() {
    this.hasMany(Session, {
      foreignKey: "userId",
      as: "sessions",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}

export default User;
