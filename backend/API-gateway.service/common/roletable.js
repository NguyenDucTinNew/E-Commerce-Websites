// utils/roleTable.js
const routePermissions = {
  // Format: 'service:method:path'
  'order:post:create': ['admin', 'staff'],
  'user:delete:': ['admin'], // Xóa user
  'product:put:update': ['admin', 'editor'],
  'report:get:': ['admin', 'manager'], // Xem report
};
const servicePermissions = {
  // Format: 'service': ['allowedRoles']
  order: ["admin", "staff"],
  user: ["admin"],
  report: ["admin", "manager"],
  // Thêm các service khác tại đây
};
