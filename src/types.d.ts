declare module 'node-sys' {
    export function isString(input: any): boolean;
    export function isUndefined(input: any): boolean;
    export function isWindows(): boolean;
    export function isBool(input: any): boolean;
    export function spawning(
        cmd: string,
        args: string[],
        options: {
            stdio: string;
            onprogress: (object: { output: any }) => string[];
            onerror: (data: string) => Error | undefined;
        }
    ): Promise<string[]>;
}
