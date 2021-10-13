const router = require("./itemsRoutes");

describe("items routes", () => {
  test("valid path and method in endpoints", () => {
    const routes = [{ path: "/items", method: "get" }];
    for (const route of routes) {
      const match = router.stack.find(
        (s) => s.route.path === route.path && s.route.methods[route.method]
      );
      expect(match).toBeTruthy();
    }
  });
});
