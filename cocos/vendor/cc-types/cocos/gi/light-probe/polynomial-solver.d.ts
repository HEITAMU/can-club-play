export declare class PolynomialSolver {
    /**
     * solve quadratic equation: b * t^2 + c * t + d = 0
     * return the unique real positive root
     */
    static getQuadraticUniqueRoot(b: number, c: number, d: number): number;
    /**
     * solve cubic equation: t^3 + b * t^2 + c * t + d = 0
     * return the unique real positive root
     */
    static getCubicUniqueRoot(b: number, c: number, d: number): number;
}
