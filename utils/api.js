// var api = require('./public.js');
// const host = 'http://test.dtc233.com/api/home/'
const host = 'https://test.dtc233.com/api/home/'
const host2 = 'https://test.dtc233.com/api/admin/'

export const ERR_OK = 200

// 登录接口
export const userListUrl = host2 + 'user/list';

// 登录接口
export const loginUrl = host + 'user/login';
// 我发布的任务
export const list1Url = host + 'my_order/task';
// 抢单中心
export const list2Url = host + 'task_list';
// 我抢的单子
export const list3Url = host + 'my_accept/task';
// 工种列表
export const categoryListUrl = host + 'categoryList';
// 申请成为师傅(后台需要审核)
export const applicationUrl = host + 'master/application';
// 发布任务
export const taskAddUrl = host + 'task/add';
// 师傅接单(动作)
export const taskAcceptUrl = host + 'task/accept';
// 取消任务(24小时后)
export const taskCanceltUrl = host + 'task/cancel';
// 查看申请状态
export const statusUrl = host + 'Application/status';
// 用户信息
export const userInfoUrl = host + 'user/info';

// 首页
export const indexUrl = host + 'index';
// 任务详情
export const taskDetailUrl = host + 'task/detail';
// 对任务发布人的评价
export const userCommentUrl = host + 'task/user/comment';
// 对师傅的评价
export const masterCommentUrl = host + 'task/master/comment';
// 下架任务（进行中的单子）
export const soldOutUrl = host + 'task/user/cancel';
// 进行中的任务的师傅取消申请
export const masterCancelTaskUrl = host + 'task/master/cancel';
// 进行中的任务的任务发布者取消申请
export const userCancelTaskUrl = host + 'task/user/cancel';
// 问题反馈
export const feedbackPostUrl = host + 'feedback/post';
// 图片上传接口
export const imgUploadUrl = host + 'img/upload';
// 汇报施工情况
export const reportUrl = host + 'my_accept/task/report';
// 用户完成任务(确定按钮)
export const completedUrl = host + 'task/Completed';