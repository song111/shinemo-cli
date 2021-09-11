"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var simo_utils_1 = require("@chrissong/simo-utils");
var lodash_1 = __importDefault(require("lodash"));
// 模版仓库
var templateStorePath = path_1.default.join(__dirname, '../../templateStore.json');
/**
 * 项目初始化
 * @param{object} cli   cli实例对象
 * @param{object} argv  命令行参数
 */
var template = function (cli, argv) { return __awaiter(void 0, void 0, void 0, function () {
    var action, name, repository, description, templatesData, displayTemplates, addTemplate, removeTemplate;
    return __generator(this, function (_a) {
        action = argv.action, name = argv.name, repository = argv.repository, description = argv.description;
        templatesData = JSON.parse(simo_utils_1.fs.readFileSync(templateStorePath, { encoding: 'utf8' }));
        displayTemplates = function () {
            if (lodash_1.default.isEmpty(templatesData)) {
                simo_utils_1.logger.warn("Currently,you have not add any tempaltes!");
            }
            else {
                console.table(templatesData);
            }
        };
        addTemplate = function () {
            if (lodash_1.default.has(templatesData, name)) {
                return simo_utils_1.logger.error("The template named " + simo_utils_1.chalk.red(name) + " is exist!");
            }
            else {
                templatesData[name] = {
                    name: name,
                    repository: repository,
                    description: description,
                    isBuiltIn: false,
                };
                simo_utils_1.fs.writeFileSync(templateStorePath, JSON.stringify(templatesData, null, 2), {
                    encoding: 'utf8',
                });
                simo_utils_1.logger.done("The template named " + simo_utils_1.chalk.green(name) + " has been added!");
            }
        };
        removeTemplate = function () {
            // 只有新增的模版可以删除，内置模版不可以删除
            if (!lodash_1.default.has(templatesData, name)) {
                return simo_utils_1.logger.error("The template named " + simo_utils_1.chalk.red(name) + " is not exist!");
            }
            if (templatesData[name].isBuiltIn) {
                return simo_utils_1.logger.warn("The template named " + simo_utils_1.chalk.yellow(name) + " is built template,can`t be remove!");
            }
            else {
                delete templatesData[name];
                simo_utils_1.fs.writeFileSync(templateStorePath, JSON.stringify(templatesData, null, 2), {
                    encoding: 'utf8',
                });
                simo_utils_1.logger.done("The template named " + simo_utils_1.chalk.green(name) + " has been removed!");
            }
        };
        // 显示模版
        switch (action) {
            case 'ls':
                return [2 /*return*/, displayTemplates()];
            case 'add':
                return [2 /*return*/, addTemplate()];
            case 'remove':
                return [2 /*return*/, removeTemplate()];
        }
        return [2 /*return*/];
    });
}); };
exports.default = template;
//# sourceMappingURL=template.js.map