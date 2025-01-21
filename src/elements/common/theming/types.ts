export interface Theme {
    tokens?: Record<string, unknown>;
}

export interface ThemingProps {
    selector?: string;
    theme?: Theme;
}
