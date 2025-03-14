import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface IFAQ {
  id: string;
  question: string;
  answer: string;
}

interface FAQCreationAttributes extends Optional<IFAQ, "id"> {}

class FAQ extends Model<IFAQ, FAQCreationAttributes> implements IFAQ {
  public id!: string;
  public question!: string;
  public answer!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initialize(sequelize: Sequelize) {
    FAQ.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        question: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        answer: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        modelName: "FAQ",
        tableName: "faqs",
        sequelize,
        timestamps: true,
      }
    );
  }
}

export default FAQ;
