export default interface IAlgorithm {
    algorithm: string;
    weights: number[];
    modulo: number[];
    complements: {
        type: "range" | "replace";
        from: string | number;
        to: string | number;
    };
}
