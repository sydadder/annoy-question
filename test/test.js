var AppDAO = require("../models/jsonDb.js");

test("a passing test", () => {
  expect(AppDAO.getdynamiclist().length).toBe(4);
});
