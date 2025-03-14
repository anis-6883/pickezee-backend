import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface ISetting {
  id: string;
  name: string;
  value: string;
  group: string;
}

interface SettingCreationAttributes extends Optional<ISetting, "id"> {}

class Setting extends Model<ISetting, SettingCreationAttributes> implements ISetting {
  public id!: string;
  public name!: string;
  public value!: string;
  public group!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initialize(sequelize: Sequelize) {
    Setting.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(127),
          allowNull: false,
          unique: true,
        },
        value: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        group: {
          type: DataTypes.STRING(31),
          allowNull: false,
        },
      },
      {
        modelName: "Setting",
        tableName: "settings",
        sequelize,
        timestamps: true,
        indexes: [{ unique: true, fields: ["name"] }],
      }
    );
  }
}

export default Setting;
