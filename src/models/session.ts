import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { ISession } from "../configs/interfaces";
import User from "./user";

interface SessionCreationAttributes extends Optional<ISession, "id"> {}

class Session extends Model<ISession, SessionCreationAttributes> implements ISession {
  public id: string;
  public token: string;
  public userAgent: string;
  public ipAddress: string;
  public expireAt: Date;
  public userId: string;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
}

export const initializeSession = (sequelize: Sequelize) => {
  Session.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      token: {
        type: DataTypes.CHAR(64), // SHA-256 Hashed Token
        allowNull: false,
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      ipAddress: {
        type: DataTypes.INET,
        allowNull: false,
      },
      expireAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: User,
          key: "id",
        },
      },
    },
    {
      modelName: "Session",
      tableName: "sessions",
      sequelize,
      indexes: [
        {
          unique: true,
          fields: ["token"],
        },
      ],
    }
  );
};

export default Session;
