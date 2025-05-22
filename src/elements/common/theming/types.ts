export type Theme = {
    tokens?: Record<string, unknown>;
};

export interface ThemingProps {
    selector?: string;
    theme?: Theme;
}
