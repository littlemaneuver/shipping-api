module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["<rootDir>/**/*.spec.ts?(x)"],
    moduleFileExtensions: ["ts", "js", "json"],
    modulePathIgnorePatterns: ["<rootDir>/build/"],
    verbose: true,
    maxWorkers: 4,
    cacheDirectory: ".jest-cache",
    transform: {
        "^.+\\.ts$": ["ts-jest", { tsconfig: "test/tsconfig.json" }],
    },
};
