export type Theme = {
    tokens?: Record<string, unknown>;
};

export interface ThemingProps {
    theme?: Theme;
}
