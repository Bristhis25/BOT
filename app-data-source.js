"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const user_response_entity_1 = require("./models/user-response.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'sqlite',
    database: 'data',
    synchronize: true,
    logging: false,
    entities: [user_response_entity_1.UserResponse],
});
