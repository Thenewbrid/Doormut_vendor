import requests from "./httpService";

const VendorServices = {
  login: async (body) => {
    return requests.post("/vendors/login", body);
  },
  forgetPassword: async (body) => {
    return requests.put("/vendors/forget", body);
  },
  resetPassword: async (body) => {
    return requests.put("/vendors/reset", body);
  },

  getVendorOrders: async (storeid, id, isRecent) => {
    const recent = isRecent !== undefined ? isRecent : "";
    return requests.get(
      `/vendors/orders/${storeid}${id ? `/${id}` : ""}?recent=${recent}`
    );
  },

  getfilteredOrders: async ({
    storeid,
    searchName,
    status,
    startDate,
    endDate,
    day,
    page,
    limit,
    method,
  }) => {
    const dateRange = `${startDate},${endDate}`;
    return requests.get(
      `/vendors/orders/${storeid}?search=${searchName}&status=${status}${
        startDate && endDate ? `&dateRange=${dateRange}` : ""
      }&day=${day}&method=${method}&page=${page}&limit=${limit}`
    );
  },

  getAllStaffs: async ({ id, search }) => {
    return requests.get(`/vendors/staffs/${id}`);
  },
  findStaffById: async (vendorId, staffId) => {
    return requests.get(`/vendors/staffs/${vendorId}/${staffId}`);
  },
  addStaff: async (vendorId, body) => {
    return requests.post(`/vendors/add/${vendorId}`, body);
  },
  updateStaffs: async (vendorId, staffId, body) => {
    return requests.put(`/vendors/staffs/${vendorId}/${staffId}`, body);
  },
  deleteStaff: async (vendorId, staffId) => {
    return requests.delete(`/vendors/staffs/${vendorId}/${staffId}`);
  },
};

export default VendorServices;
