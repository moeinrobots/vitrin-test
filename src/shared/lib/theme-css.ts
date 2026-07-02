type ThemeMode = 'light' | 'dark';

type ThemeToken =
    | 'background'
    | 'foreground'
    | 'card'
    | 'card-foreground'
    | 'popover'
    | 'popover-foreground'
    | 'primary'
    | 'primary-foreground'
    | 'secondary'
    | 'secondary-foreground'
    | 'muted'
    | 'muted-foreground'
    | 'accent'
    | 'accent-foreground'
    | 'destructive'
    | 'border'
    | 'input'
    | 'ring'
    | 'chart-1'
    | 'chart-2'
    | 'chart-3'
    | 'chart-4'
    | 'chart-5'
    | 'sidebar'
    | 'sidebar-foreground'
    | 'sidebar-primary'
    | 'sidebar-primary-foreground'
    | 'sidebar-accent'
    | 'sidebar-accent-foreground'
    | 'sidebar-border'
    | 'sidebar-ring'
    | 'radius';

export type RuntimeTheme = Partial<Record<ThemeMode, ThemeVariables>> & {
    colors?: ThemeVariables;
};

type ThemeVariables = Partial<Record<ThemeToken, string>>;
type ThemePayload = Record<string, unknown>;

const tokenAliases: Record<string, ThemeToken> = {
    background: 'background',
    foreground: 'foreground',
    card: 'card',
    cardForeground: 'card-foreground',
    'card-foreground': 'card-foreground',
    popover: 'popover',
    popoverForeground: 'popover-foreground',
    'popover-foreground': 'popover-foreground',
    primary: 'primary',
    primaryForeground: 'primary-foreground',
    'primary-foreground': 'primary-foreground',
    secondary: 'secondary',
    secondaryForeground: 'secondary-foreground',
    'secondary-foreground': 'secondary-foreground',
    muted: 'muted',
    mutedForeground: 'muted-foreground',
    'muted-foreground': 'muted-foreground',
    accent: 'accent',
    accentForeground: 'accent-foreground',
    'accent-foreground': 'accent-foreground',
    destructive: 'destructive',
    border: 'border',
    input: 'input',
    ring: 'ring',
    chart1: 'chart-1',
    'chart-1': 'chart-1',
    chart2: 'chart-2',
    'chart-2': 'chart-2',
    chart3: 'chart-3',
    'chart-3': 'chart-3',
    chart4: 'chart-4',
    'chart-4': 'chart-4',
    chart5: 'chart-5',
    'chart-5': 'chart-5',
    sidebar: 'sidebar',
    sidebarForeground: 'sidebar-foreground',
    'sidebar-foreground': 'sidebar-foreground',
    sidebarPrimary: 'sidebar-primary',
    'sidebar-primary': 'sidebar-primary',
    sidebarPrimaryForeground: 'sidebar-primary-foreground',
    'sidebar-primary-foreground': 'sidebar-primary-foreground',
    sidebarAccent: 'sidebar-accent',
    'sidebar-accent': 'sidebar-accent',
    sidebarAccentForeground: 'sidebar-accent-foreground',
    'sidebar-accent-foreground': 'sidebar-accent-foreground',
    sidebarBorder: 'sidebar-border',
    'sidebar-border': 'sidebar-border',
    sidebarRing: 'sidebar-ring',
    'sidebar-ring': 'sidebar-ring',
    radius: 'radius',
};

export function createRuntimeThemeCss(theme: RuntimeTheme | null) {
    if (!theme) return null;

    const commonVariables = normalizeVariables(theme.colors);
    const lightVariables = normalizeVariables({
        ...commonVariables,
        ...theme.light,
    });
    const darkVariables = normalizeVariables({
        ...commonVariables,
        ...theme.dark,
    });
    const blocks = [
        createCssBlock(':root:not(.dark)', lightVariables),
        createCssBlock('.dark', darkVariables),
    ].filter(Boolean);

    if (blocks.length === 0) return null;

    return blocks.join('\n');
}

export function normalizeRuntimeTheme(payload: unknown): RuntimeTheme | null {
    const theme = unwrapPayload(payload);
    if (!isRecord(theme)) return null;

    const normalized: RuntimeTheme = {};
    const colors = normalizeVariables(theme.colors);
    const topLevelColors = normalizeVariables(theme);
    const light = normalizeVariables(theme.light);
    const dark = normalizeVariables(theme.dark);

    if (
        Object.keys(colors).length > 0 ||
        Object.keys(topLevelColors).length > 0
    ) {
        normalized.colors = {
            ...topLevelColors,
            ...colors,
        };
    }

    if (Object.keys(light).length > 0) {
        normalized.light = light;
    }

    if (Object.keys(dark).length > 0) {
        normalized.dark = dark;
    }

    return Object.keys(normalized).length > 0 ? normalized : null;
}

function unwrapPayload(payload: unknown): unknown {
    if (!isRecord(payload)) return payload;

    const candidates = [payload.theme, payload.data, payload.settings];

    return candidates.find(isRecord) ?? payload;
}

function normalizeVariables(value: unknown): ThemeVariables {
    if (!isRecord(value)) return {};

    return Object.entries(value).reduce<ThemeVariables>(
        (variables, [key, raw]) => {
            const token = tokenAliases[key];

            if (!token || typeof raw !== 'string' || !isSafeCssValue(raw)) {
                return variables;
            }

            variables[token] = raw.trim();

            return variables;
        },
        {},
    );
}

function createCssBlock(selector: string, variables: ThemeVariables) {
    const declarations = Object.entries(variables).map(
        ([token, value]) => `--${token}:${value}`,
    );

    if (declarations.length === 0) return null;

    return `${selector}{${declarations.join(';')}}`;
}

function isRecord(value: unknown): value is ThemePayload {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSafeCssValue(value: string) {
    const trimmed = value.trim();

    return (
        trimmed.length > 0 &&
        trimmed.length <= 120 &&
        !/[;{}<>"'`\\]/.test(trimmed) &&
        !/(?:url|expression|@import)/i.test(trimmed) &&
        /^[#\w\s.,%()/+-]+$/.test(trimmed)
    );
}
