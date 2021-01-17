import inquirer from 'inquirer';

import { IPkgParams } from '../type';

// 获取输入参数
const getPkgParams = async (): Promise<IPkgParams> => {
  return await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: '请输入项目名称?',
    },
    {
      type: 'input',
      name: 'version',
      message: '请输入版本号?',
      default: '1.0.0',
    },
    {
      type: 'input',
      name: 'auther',
      message: '请输入作者名称？',
    },
    {
      type: 'input',
      name: 'description',
      message: '请输入描述？',
    },
  ]);
};

export default getPkgParams;
