const router = require("./zombieRoutes");

describe("zombie routes", () => {
  test("valid path and method in endpoints", () => {
    const routes = [
      { path: "/zombie", method: "post" },
      { path: "/zombies", method: "get" },
      { path: "/zombie/:zombieId", method: "get" },
      { path: "/zombie/:zombieId", method: "put" },
      { path: "/zombie/:zombieId", method: "delete" },
      { path: "/zombie/:zombieId/value", method: "get" },
      { path: "/zombie/:zombieId/:itemId", method: "put" },
      { path: "/zombie/:zombieId/:itemId", method: "delete" },
    ];
    for (const route of routes) {
      const match = router.stack.find((s) => {
        s.route.path === route.path && s.route.methods[route.method];
      });
      expect(match).toBeTruthy();
    }
  });
});
