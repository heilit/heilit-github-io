type EasingFunction = (progress: number) => number;

interface EasingDictionary {
    easeOutQuad: EasingFunction;
    easeInOutQuad: EasingFunction;
    easeInOutCubic: EasingFunction;
}

const pow = Math.pow;

const easings: EasingDictionary = {
    easeOutQuad: x => 1 - (1 - x) * (1 - x),
    easeInOutQuad: x => (x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2),
    easeInOutCubic: x => (x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2)
};

export default easings;
