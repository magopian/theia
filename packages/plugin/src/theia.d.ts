/********************************************************************************
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

// This file is heavily inspired by VSCode 'vscode.d.ts' - https://github.com/Microsoft/vscode/blob/master/src/vs/vscode.d.ts
// 'vscode.d.ts' copyright:
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import './theia-proposed';
declare module '@theia/plugin' {

    /**
     * The version of the Theia API.
     */
    export const version: string;

    export class Disposable {

        constructor(func: () => void);
        /**
         * Dispose this object.
         */
        dispose(): void;

        static create(func: () => void): Disposable;

        /**
         * Combine many disposable-likes into one. Use this method
         * when having objects with a dispose function which are not
         * instances of Disposable.
         *
         * @param disposableLikes Objects that have at least a `dispose`-function member.
         * @return Returns a new disposable which, upon dispose, will
         * dispose all provided disposables.
         */
        static from(...disposableLikes: { dispose: () => any }[]): Disposable;

        /**
        * Creates a new Disposable calling the provided function
        * on dispose.
        * @param callOnDispose Function that disposes something.
        */
        constructor(callOnDispose: Function);

    }

    export type PluginType = 'frontend' | 'backend';

    /**
     * Represents an plugin.
     *
     * To get an instance of an `Plugin` use [getPlugin](#plugins.getPlugin).
     */
    export interface Plugin<T> {

        /**
         * The canonical plug-in identifier in the form of: `publisher.name`.
         */
        readonly id: string;

        /**
         * The absolute file path of the directory containing this plug-in.
         */
        readonly pluginPath: string;

        /**
         * `true` if the plug-in has been activated.
         */
        readonly isActive: boolean;

        /**
         * The parsed contents of the plug-in's package.json.
         */
        readonly packageJSON: any;

        /**
         *
         */
        readonly pluginType: PluginType;

        /**
         * The public API exported by this plug-in. It is an invalid action
         * to access this field before this plug-in has been activated.
         */
        readonly exports: T;

        /**
         * Activates this plug-in and returns its public API.
         *
         * @return A promise that will resolve when this plug-in has been activated.
         */
        activate(): PromiseLike<T>;
    }

    /**
     * Namespace for dealing with installed plug-ins. Plug-ins are represented
     * by an [plug-in](#Plugin)-interface which enables reflection on them.
     *
     * Plug-in writers can provide APIs to other plug-ins by returning their API public
     * surface from the `start`-call.
     *
     * ```javascript
     * export function start() {
     *     let api = {
     *         sum(a, b) {
     *             return a + b;
     *         },
     *         mul(a, b) {
     *             return a * b;
     *         }
     *     };
     *     // 'export' public api-surface
     *     return api;
     * }
     * ```
     * ```javascript
     * let mathExt = plugins.getPlugin('genius.math');
     * let importedApi = mathExt.exports;
     *
     * console.log(importedApi.mul(42, 1));
     * ```
     */
    export namespace plugins {
        /**
         * Get an plug-in by its full identifier in the form of: `publisher.name`.
         *
         * @param pluginId An plug-in identifier.
         * @return An plug-in or `undefined`.
         */
        export function getPlugin(pluginId: string): Plugin<any> | undefined;

        /**
         * Get an plug-in its full identifier in the form of: `publisher.name`.
         *
         * @param pluginId An plug-in identifier.
         * @return An plug-in or `undefined`.
         */
        export function getPlugin<T>(pluginId: string): Plugin<T> | undefined;

        /**
         * All plug-ins currently known to the system.
         */
        export let all: Plugin<any>[];
    }

    /**
 * A command is a unique identifier of a function
 * which can be executed by a user via a keyboard shortcut,
 * a menu action or directly.
 */
    export interface CommandDescription {
        /**
         * A unique identifier of this command.
         */
        id: string;
        /**
         * A label of this command.
         */
        label?: string;
        /**
          * A tooltip for for command, when represented in the UI.
          */
        tooltip?: string;
        /**
         * An icon class of this command.
         */
        iconClass?: string;
    }
    /**
     * Command represents a particular invocation of a registered command.
     */
    export interface Command {
        /**
         * The identifier of the actual command handler.
         */
        command?: string;
        /**
        * Title of the command invocation, like "Add local varible 'foo'".
        */
        title?: string;
        /**
          * A tooltip for for command, when represented in the UI.
          */
        tooltip?: string;
        /**
         * Arguments that the command handler should be
         * invoked with.
         */
        arguments?: any[];

        /**
         * @deprecated use command instead
         */
        id?: string;
        /**
         * @deprecated use title instead
         */
        label?: string;
    }

    /**
     * Represents a line and character position.
     */
    export class Position {

        /**
         * The zero-based line value.
         */
        readonly line: number;

        /**
         * The zero-based character value.
         */
        readonly character: number;

        constructor(line: number, character: number);

        /**
         * Check if this position is before `other`.
         *
         * @param other A position.
         * @return `true` if position is on a smaller line
         * or on the same line on a smaller character.
         */
        isBefore(other: Position): boolean;

        /**
         * Check if this position is before or equal to `other`.
         *
         * @param other A position.
         * @return `true` if position is on a smaller line
         * or on the same line on a smaller or equal character.
         */
        isBeforeOrEqual(other: Position): boolean;

        /**
         * Check if this position is after `other`.
         *
         * @param other A position.
         * @return `true` if position is on a greater line
         * or on the same line on a greater character.
         */
        isAfter(other: Position): boolean;

        /**
         * Check if this position is after or equal to `other`.
         *
         * @param other A position.
         * @return `true` if position is on a greater line
         * or on the same line on a greater or equal character.
         */
        isAfterOrEqual(other: Position): boolean;

        /**
         * Check if this position is equal to `other`.
         *
         * @param other A position.
         * @return `true` if the line and character of the given position are equal to
         * the line and character of this position.
         */
        isEqual(other: Position): boolean;

        /**
         * Compare this to `other`.
         *
         * @param other A position.
         * @return A number smaller than zero if this position is before the given position,
         * a number greater than zero if this position is after the given position, or zero when
         * this and the given position are equal.
         */
        compareTo(other: Position): number;

        /**
         * Create a new position relative to this position.
         *
         * @param lineDelta Delta value for the line value, default is `0`.
         * @param characterDelta Delta value for the character value, default is `0`.
         * @return A position which line and character is the sum of the current line and
         * character and the corresponding deltas.
         */
        translate(lineDelta?: number, characterDelta?: number): Position;

        /**
         * Derived a new position relative to this position.
         *
         * @param change An object that describes a delta to this position.
         * @return A position that reflects the given delta. Will return `this` position if the change
         * is not changing anything.
         */
        translate(change: { lineDelta?: number; characterDelta?: number; }): Position;

        /**
         * Create a new position derived from this position.
         *
         * @param line Value that should be used as line value, default is the [existing value](#Position.line)
         * @param character Value that should be used as character value, default is the [existing value](#Position.character)
         * @return A position where line and character are replaced by the given values.
         */
        with(line?: number, character?: number): Position;

        /**
         * Derived a new position from this position.
         *
         * @param change An object that describes a change to this position.
         * @return A position that reflects the given change. Will return `this` position if the change
         * is not changing anything.
         */
        with(change: { line?: number; character?: number; }): Position;
    }

    /**
     * Pair of two positions.
     */
    export class Range {
        /**
         * Start position.
         */
        readonly start: Position;

        /**
         * End position.
         */
        readonly end: Position;

        /**
         * `true` if start and end are equal
         */
        isEmpty: boolean;

        /**
         * `true` if `start.line` and `end.line` are equal
         */
        isSingleLine: boolean;

        /**
         * Create a new range from two positions.
         * If `start` is not before or equal to `end`, the values will be swapped.
         *
         * @param start a position
         * @param end a position
         */
        constructor(start: Position, end: Position);

        /**
         * Create a new position from coordinates.
         *
         * @param startLine a zero based line value
         * @param startCharacter a zero based character value
         * @param endLine a zero based line value
         * @param endCharacter a zero based character value
         */
        constructor(startLine: number, startCharacter: number, endLine: number, endCharacter: number);

        /**
         * Check if a position or a range is in this range.
         *
         * @param positionOrRange a position or a range
         */
        contains(positionOrRange: Position | Range): boolean;

        /**
         * Check `other` equals this range.
         *
         * @param other a range
         */
        isEqual(other: Range): boolean;

        /**
         * Intersect `range` with this range and returns new range or `undefined`
         *
         * @param range a range
         */
        intersection(range: Range): Range | undefined;

        /**
         * Compute the union of `other` with this range.
         *
         * @param other a range
         */
        union(other: Range): Range;

        /**
         * Derived a new range from this range.
         *
         * @param start
         * @param end
         */
        with(start?: Position, end?: Position): Range;

        /**
         * Derived a new range from this range.
         */
        with(change: { start?: Position, end?: Position }): Range;
    }

    /**
     * Represents a text selection in an editor.
     */
    export class Selection extends Range {

        /**
         * Position where selection starts.
         */
        anchor: Position;

        /**
         * Position of the cursor
         */
        active: Position;

        /**
         * A selection is reversed if `active.isBefore(anchor)`
         */
        isReversed: boolean;

        /**
         * Create a selection from two positions.
         *
         * @param anchor a position
         * @param active a position
         */
        constructor(anchor: Position, active: Position);

        /**
         * Create a selection from coordinates.
         *
         * @param anchorLine a zero based line value
         * @param anchorCharacter a zero based character value
         * @param activeLine a zero based line value
         * @param activeCharacter a zero based character value
         */
        constructor(anchorLine: number, anchorCharacter: number, activeLine: number, activeCharacter: number);
    }

    /**
     * A snippet string is a template which allows to insert text
     * and to control the editor cursor when insertion happens.
     */
    export class SnippetString {

        /**
         * The snippet string.
         */
        value: string;

        constructor(value?: string);

        /**
         * Builder-function that appends the given string to
         * the [`value`](#SnippetString.value) of this snippet string.
         *
         * @param string A value to append 'as given'. The string will be escaped.
         * @return This snippet string.
         */
        appendText(string: string): SnippetString;

        /**
         * Builder-function that appends a tabstop (`$1`, `$2` etc) to
         * the [`value`](#SnippetString.value) of this snippet string.
         *
         * @param number The number of this tabstop, defaults to an auto-incremet
         * value starting at 1.
         * @return This snippet string.
         */
        appendTabstop(number?: number): SnippetString;

        /**
         * Builder-function that appends a placeholder (`${1:value}`) to
         * the [`value`](#SnippetString.value) of this snippet string.
         *
         * @param value The value of this placeholder - either a string or a function
         * with which a nested snippet can be created.
         * @param number The number of this tabstop, defaults to an auto-incremet
         * value starting at 1.
         * @return This snippet string.
         */
        appendPlaceholder(value: string | ((snippet: SnippetString) => any), number?: number): SnippetString;

        /**
         * Builder-function that appends a variable (`${VAR}`) to
         * the [`value`](#SnippetString.value) of this snippet string.
         *
         * @param name The name of the variable - excluding the `$`.
         * @param defaultValue The default value which is used when the variable name cannot
         * be resolved - either a string or a function with which a nested snippet can be created.
         * @return This snippet string.
         */
        appendVariable(name: string, defaultValue: string | ((snippet: SnippetString) => any)): SnippetString;
    }

    /**
     * Represents sources that can cause `window.onDidChangeEditorSelection`
     */
    export enum TextEditorSelectionChangeKind {
        Keyboard = 1,

        Mouse = 2,

        Command = 3
    }

    /**
     * Represents an event describing the change in text editor selections.
     */
    export interface TextEditorSelectionChangeEvent {
        /**
         * The text editor for which the selections have changed.
         */
        textEditor: TextEditor;
        /**
         * The new text editor selections
         */
        selections: Selection[];

        kind?: TextEditorSelectionChangeKind;
    }

    /**
     * Represents an event the change in a text editor's options
     */
    export interface TextEditorOptionsChangeEvent {
        textEditor: TextEditor;

        options: TextEditorOptions;
    }

    /**
     * Represents an event the change in a text editor's visible ranges
     */
    export interface TextEditorVisibleRangesChangeEvent {
        /**
         * The text editor for which the visible ranges have changes.
         */
        textEditor: TextEditor;
        /**
         * The new text editor visible ranges.
         */
        visibleRanges: Range[];
    }

    /**
     * Represents an event describing the change of a text editor's view column.
     */
    export interface TextEditorViewColumnChangeEvent {
        /**
         * The text editor for which the options have changed.
         */
        textEditor: TextEditor;
        /**
         * The new value for the text editor's view column.
         */
        viewColumn: ViewColumn;
    }

    /**
     * Represents a handle to a set of decorations
     * sharing the same [styling options](#DecorationRenderOptions) in a [text editor](#TextEditor).
     *
     * To get an instance of a `TextEditorDecorationType` use
     * [createTextEditorDecorationType](#window.createTextEditorDecorationType).
     */
    export interface TextEditorDecorationType {

        /**
         * Internal representation of the handle.
         */
        readonly key: string;

        /**
         * Remove this decoration type and all decorations on all text editors using it.
         */
        dispose(): void;
    }

    /**
     * Information about where a symbol is defined.
     *
     * Provides additional metadata over normal [location](#Location) definitions, including the range of
     * the defining symbol
     */
    export interface DefinitionLink {
        /**
         * Span of the symbol being defined in the source file.
         *
         * Used as the underlined span for mouse definition hover. Defaults to the word range at
         * the definition position.
         */
        originSelectionRange?: Range;

        /**
         * The resource identifier of the definition.
         */
        targetUri: Uri;

        /**
         * The full range of the definition.
         *
         * For a class definition for example, this would be the entire body of the class definition.
         */
        targetRange: Range;

        /**
         * The span of the symbol definition.
         *
         * For a class definition, this would be the class name itself in the class definition.
         */
        targetSelectionRange?: Range;
    }

    /**
     * The definition of a symbol represented as one or many [locations](#Location).
     * For most programming languages there is only one location at which a symbol is
     * defined.
     */
    export type Definition = Location | Location[];

    /**
     * The definition provider interface defines the contract between extensions and
     * the [go to definition](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-definition)
     * and peek definition features.
     */
    export interface DefinitionProvider {
        /**
         * Provide the definition of the symbol at the given position and document.
         *
         * @param document The document in which the command was invoked.
         * @param position The position at which the command was invoked.
         * @param token A cancellation token.
         * @return A definition or a thenable that resolves to such. The lack of a result can be
         * signaled by returning `undefined` or `null`.
         */
        provideDefinition(document: TextDocument, position: Position, token: CancellationToken | undefined): ProviderResult<Definition | DefinitionLink[]>;
    }

    /**
     * The implementation provider interface defines the contract between extensions and
     * the go to implementation feature.
     */
    export interface ImplementationProvider {

        /**
         * Provide the implementations of the symbol at the given position and document.
         *
         * @param document The document in which the command was invoked.
         * @param position The position at which the command was invoked.
         * @param token A cancellation token.
         * @return A definition or a thenable that resolves to such. The lack of a result can be
         * signaled by returning `undefined` or `null`.
         */
        provideImplementation(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Definition | DefinitionLink[]>;
    }

    /**
     * The type definition provider defines the contract between extensions and
     * the go to type definition feature.
     */
    export interface TypeDefinitionProvider {

        /**
         * Provide the type definition of the symbol at the given position and document.
         *
         * @param document The document in which the command was invoked.
         * @param position The position at which the command was invoked.
         * @param token A cancellation token.
         * @return A definition or a thenable that resolves to such. The lack of a result can be
         * signaled by returning `undefined` or `null`.
         */
        provideTypeDefinition(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Definition | DefinitionLink[]>;
    }

    /**
     * The MarkdownString represents human readable text that supports formatting via the
     * markdown syntax. Standard markdown is supported, also tables, but no embedded html.
     */
    export class MarkdownString {

        /**
         * The markdown string.
         */
        value: string;

        /**
         * Indicates that this markdown string is from a trusted source. Only *trusted*
         * markdown supports links that execute commands, e.g. `[Run it](command:myCommandId)`.
         */
        isTrusted?: boolean;

        /**
         * Creates a new markdown string with the given value.
         *
         * @param value Optional, initial value.
         */
        constructor(value?: string);

        /**
         * Appends and escapes the given string to this markdown string.
         * @param value Plain text.
         */
        appendText(value: string): MarkdownString;

        /**
         * Appends the given string 'as is' to this markdown string.
         * @param value Markdown string.
         */
        appendMarkdown(value: string): MarkdownString;

        /**
         * Appends the given string as codeblock using the provided language.
         * @param value A code snippet.
         * @param language An optional [language identifier](#languages.getLanguages).
         */
        appendCodeblock(value: string, language?: string): MarkdownString;
    }

    /**
     * ~~MarkedString can be used to render human readable text. It is either a markdown string
     * or a code-block that provides a language and a code snippet. Note that
     * markdown strings will be sanitized - that means html will be escaped.~~
     *
     * @deprecated This type is deprecated, please use [`MarkdownString`](#MarkdownString) instead.
     */
    export type MarkedString = MarkdownString | string | { language: string; value: string }; // keep for compatibility reason

    export interface ThemableDecorationAttachmentRenderOptions {
        /**
         * Defines a text content that is shown in the attachment. Either an icon or a text can be shown, but not both.
         */
        contentText?: string;
        /**
         * An **absolute path** or an URI to an image to be rendered in the attachment. Either an icon
         * or a text can be shown, but not both.
         */
        contentIconPath?: string | Uri;
        /**
         * CSS styling property that will be applied to the decoration attachment.
         */
        border?: string;
        /**
         * CSS styling property that will be applied to text enclosed by a decoration.
         */
        borderColor?: string | ThemeColor;
        /**
         * CSS styling property that will be applied to the decoration attachment.
         */
        fontStyle?: string;
        /**
         * CSS styling property that will be applied to the decoration attachment.
         */
        fontWeight?: string;
        /**
         * CSS styling property that will be applied to the decoration attachment.
         */
        textDecoration?: string;
        /**
         * CSS styling property that will be applied to the decoration attachment.
         */
        color?: string | ThemeColor;
        /**
         * CSS styling property that will be applied to the decoration attachment.
         */
        backgroundColor?: string | ThemeColor;
        /**
         * CSS styling property that will be applied to the decoration attachment.
         */
        margin?: string;
        /**
         * CSS styling property that will be applied to the decoration attachment.
         */
        width?: string;
        /**
         * CSS styling property that will be applied to the decoration attachment.
         */
        height?: string;
    }

    export interface ThemableDecorationInstanceRenderOptions {
        /**
         * Defines the rendering options of the attachment that is inserted before the decorated text
         */
        before?: ThemableDecorationAttachmentRenderOptions;

        /**
         * Defines the rendering options of the attachment that is inserted after the decorated text
         */
        after?: ThemableDecorationAttachmentRenderOptions;
    }

    export interface DecorationInstanceRenderOptions extends ThemableDecorationInstanceRenderOptions {
        /**
         * Overwrite options for light themes.
         */
        light?: ThemableDecorationInstanceRenderOptions;

        /**
         * Overwrite options for dark themes.
         */
        dark?: ThemableDecorationInstanceRenderOptions;
    }

    /**
     * Represents options for a specific decoration in a [decoration set](#TextEditorDecorationType).
     */
    export interface DecorationOptions {

        /**
         * Range to which this decoration is applied. The range must not be empty.
         */
        range: Range;

        /**
         * A message that should be rendered when hovering over the decoration.
         */
        hoverMessage?: MarkedString | MarkedString[];

        /**
         * Render options applied to the current decoration. For performance reasons, keep the
         * number of decoration specific options small, and use decoration types whereever possible.
         */
        renderOptions?: DecorationInstanceRenderOptions;
    }

    /**
     * Represents theme specific rendering styles for a [text editor decoration](#TextEditorDecorationType).
     */
    export interface ThemableDecorationRenderOptions {
        /**
         * Background color of the decoration. Use rgba() and define transparent background colors to play well with other decorations.
         * Alternatively a color from the color registry can be [referenced](#ThemeColor).
         */
        backgroundColor?: string | ThemeColor;

        /**
         * CSS styling property that will be applied to text enclosed by a decoration.
         */
        outline?: string;

        /**
         * CSS styling property that will be applied to text enclosed by a decoration.
         * Better use 'outline' for setting one or more of the individual outline properties.
         */
        outlineColor?: string | ThemeColor;

        /**
         * CSS styling property that will be applied to text enclosed by a decoration.
         * Better use 'outline' for setting one or more of the individual outline properties.
         */
        outlineStyle?: string;

        /**
         * CSS styling property that will be applied to text enclosed by a decoration.
         * Better use 'outline' for setting one or more of the individual outline properties.
         */
        outlineWidth?: string;

        /**
         * CSS styling property that will be applied to text enclosed by a decoration.
         */
        border?: string;

        /**
         * CSS styling property that will be applied to text enclosed by a decoration.
         * Better use 'border' for setting one or more of the individual border properties.
         */
        borderColor?: string | ThemeColor;

        /**
         * CSS styling property that will be applied to text enclosed by a decoration.
         * Better use 'border' for setting one or more of the individual border properties.
         */
        borderRadius?: string;

        /**
         * CSS styling property that will be applied to text enclosed by a decoration.
         * Better use 'border' for setting one or more of the individual border properties.
         */
        borderSpacing?: string;

        /**
         * CSS styling property that will be applied to text enclosed by a decoration.
         * Better use 'border' for setting one or more of the individual border properties.
         */
        borderStyle?: string;

        /**
         * CSS styling property that will be applied to text enclosed by a decoration.
         * Better use 'border' for setting one or more of the individual border properties.
         */
        borderWidth?: string;

        /**
         * CSS styling property that will be applied to text enclosed by a decoration.
         */
        fontStyle?: string;

        /**
         * CSS styling property that will be applied to text enclosed by a decoration.
         */
        fontWeight?: string;

        /**
         * CSS styling property that will be applied to text enclosed by a decoration.
         */
        textDecoration?: string;

        /**
         * CSS styling property that will be applied to text enclosed by a decoration.
         */
        cursor?: string;

        /**
         * CSS styling property that will be applied to text enclosed by a decoration.
         */
        color?: string | ThemeColor;

        /**
         * CSS styling property that will be applied to text enclosed by a decoration.
         */
        opacity?: string;

        /**
         * CSS styling property that will be applied to text enclosed by a decoration.
         */
        letterSpacing?: string;

        /**
         * An **absolute path** or an URI to an image to be rendered in the gutter.
         */
        gutterIconPath?: string | Uri;

        /**
         * Specifies the size of the gutter icon.
         * Available values are 'auto', 'contain', 'cover' and any percentage value.
         * For further information: https://msdn.microsoft.com/en-us/library/jj127316(v=vs.85).aspx
         */
        gutterIconSize?: string;

        /**
         * The color of the decoration in the overview ruler. Use rgba() and define transparent colors to play well with other decorations.
         */
        overviewRulerColor?: string | ThemeColor;

        /**
         * Defines the rendering options of the attachment that is inserted before the decorated text
         */
        before?: ThemableDecorationAttachmentRenderOptions;

        /**
         * Defines the rendering options of the attachment that is inserted after the decorated text
         */
        after?: ThemableDecorationAttachmentRenderOptions;
    }

    /**
     * Describes the behavior of decorations when typing/editing at their edges.
     */
    export enum DecorationRangeBehavior {
        /**
         * The decoration's range will widen when edits occur at the start or end.
         */
        OpenOpen = 0,
        /**
         * The decoration's range will not widen when edits occur at the start of end.
         */
        ClosedClosed = 1,
        /**
         * The decoration's range will widen when edits occur at the start, but not at the end.
         */
        OpenClosed = 2,
        /**
         * The decoration's range will widen when edits occur at the end, but not at the start.
         */
        ClosedOpen = 3
    }

    /**
     * Represents different positions for rendering a decoration in an [overview ruler](#DecorationRenderOptions.overviewRulerLane).
     * The overview ruler supports three lanes.
     */
    export enum OverviewRulerLane {
        Left = 1,
        Center = 2,
        Right = 4,
        Full = 7
    }

    /**
     * Represents rendering styles for a [text editor decoration](#TextEditorDecorationType).
     */
    export interface DecorationRenderOptions extends ThemableDecorationRenderOptions {
        /**
         * Should the decoration be rendered also on the whitespace after the line text.
         * Defaults to `false`.
         */
        isWholeLine?: boolean;

        /**
         * Customize the growing behavior of the decoration when edits occur at the edges of the decoration's range.
         * Defaults to `DecorationRangeBehavior.OpenOpen`.
         */
        rangeBehavior?: DecorationRangeBehavior;

        /**
         * The position in the overview ruler where the decoration should be rendered.
         */
        overviewRulerLane?: OverviewRulerLane;

        /**
         * Overwrite options for light themes.
         */
        light?: ThemableDecorationRenderOptions;

        /**
         * Overwrite options for dark themes.
         */
        dark?: ThemableDecorationRenderOptions;
    }

    /**
     * Represents different [reveal](#TextEditor.revealRange) strategies in a text editor.
     */
    export enum TextEditorRevealType {
        /**
         * The range will be revealed with as little scrolling as possible.
         */
        Default = 0,
        /**
         * The range will always be revealed in the center of the viewport.
         */
        InCenter = 1,
        /**
         * If the range is outside the viewport, it will be revealed in the center of the viewport.
         * Otherwise, it will be revealed with as little scrolling as possible.
         */
        InCenterIfOutsideViewport = 2,
        /**
         * The range will always be revealed at the top of the viewport.
         */
        AtTop = 3
    }

    /**
     * Represents a text editor.
     * To close editor use 'workbench.action.closeActiveEditor' command.
     */
    export interface TextEditor {
        /**
         * The document associated with this text editor. The document will be the same for the entire lifetime of this text editor.
         */
        readonly document: TextDocument;

        /**
         * The primary selection on this text editor. Shorthand for `TextEditor.selections[0]`.
         */
        selection: Selection;

        /**
         * The selections in this text editor. The primary selection is always at index 0.
         */
        selections: Selection[];

        /**
         * The current visible ranges in the editor (vertically).
         * This accounts only for vertical scrolling, and not for horizontal scrolling.
         */
        readonly visibleRanges: Range[];

        /**
         * Text editor options.
         */
        options: TextEditorOptions;

        /**
         * The column in which this editor shows. Will be `undefined` in case this
         * isn't one of the three main editors, e.g an embedded editor.
         */
        viewColumn?: ViewColumn;

        /**
         * Perform an edit on the document associated with this text editor.
         *
         * The given callback-function is invoked with an [edit-builder](#TextEditorEdit) which must
         * be used to make edits. Note that the edit-builder is only valid while the
         * callback executes.
         *
         * @param callback A function which can create edits using an [edit-builder](#TextEditorEdit).
         * @param options The undo/redo behavior around this edit. By default, undo stops will be created before and after this edit.
         * @return A promise that resolves with a value indicating if the edits could be applied.
         */
        edit(callback: (editBuilder: TextEditorEdit) => void, options?: { undoStopBefore: boolean; undoStopAfter: boolean; }): PromiseLike<boolean>;

        /**
         * Insert a [snippet](#SnippetString) and put the editor into snippet mode. "Snippet mode"
         * means the editor adds placeholders and additionals cursors so that the user can complete
         * or accept the snippet.
         *
         * @param snippet The snippet to insert in this edit.
         * @param location Position or range at which to insert the snippet, defaults to the current editor selection or selections.
         * @param options The undo/redo behavior around this edit. By default, undo stops will be created before and after this edit.
         * @return A promise that resolves with a value indicating if the snippet could be inserted. Note that the promise does not signal
         * that the snippet is completely filled-in or accepted.
         */
        insertSnippet(snippet: SnippetString, location?: Position | Range | Position[] | Range[], options?: { undoStopBefore: boolean; undoStopAfter: boolean; }): PromiseLike<boolean>;

        /**
         * Adds a set of decorations to the text editor. If a set of decorations already exists with
         * the given [decoration type](#TextEditorDecorationType), they will be replaced.
         *
         * @see [createTextEditorDecorationType](#window.createTextEditorDecorationType).
         *
         * @param decorationType A decoration type.
         * @param rangesOrOptions Either [ranges](#Range) or more detailed [options](#DecorationOptions).
         */
        setDecorations(decorationType: TextEditorDecorationType, rangesOrOptions: Range[] | DecorationOptions[]): void;

        /**
         * Scroll as indicated by `revealType` in order to reveal the given range.
         *
         * @param range A range.
         * @param revealType The scrolling strategy for revealing `range`.
         */
        revealRange(range: Range, revealType?: TextEditorRevealType): void;
    }

    /**
     *
     */
    export interface TextEditorEdit {
        /**
         * Replace a certain text region with a new value.
         * You can use \r\n or \n in `value` and they will be normalized to the current [document](#TextDocument).
         *
         * @param location The range this operation should remove.
         * @param value The new text this operation should insert after removing `location`.
         */
        replace(location: Position | Range | Selection, value: string): void;

        /**
         * Insert text at a location.
         * You can use \r\n or \n in `value` and they will be normalized to the current [document](#TextDocument).
         * Although the equivalent text edit can be made with [replace](#TextEditorEdit.replace), `insert` will produce a different resulting selection (it will get moved).
         *
         * @param location The position where the new text should be inserted.
         * @param value The new text this operation should insert.
         */
        insert(location: Position, value: string): void;

        /**
         * Delete a certain text region.
         *
         * @param location The range this operation should remove.
         */
        delete(location: Range | Selection): void;

        /**
         * Set the end of line sequence.
         *
         * @param endOfLine The new end of line for the [document](#TextDocument).
         */
        setEndOfLine(endOfLine: EndOfLine): void;
    }

    /**
     * Represents a line of text, such as a line of source code.
     *
     * TextLine objects are __immutable__. When a [document](#TextDocument) changes,
     * previously retrieved lines will not represent the latest state.
     */
    export interface TextLine {
        /**
         * The zero-based line number.
         */
        readonly lineNumber: number;

        /**
         * The text of this line without the line separator characters.
         */
        readonly text: string;

        /**
         * The range this line covers without the line separator characters.
         */
        readonly range: Range;

        /**
         * The range this line covers with the line separator characters.
         */
        readonly rangeIncludingLineBreak: Range;

        /**
         * The offset of the first character which is not a whitespace character as defined
         * by `/\s/`. **Note** that if a line is all whitespaces the length of the line is returned.
         */
        readonly firstNonWhitespaceCharacterIndex: number;

        /**
         * Whether this line is whitespace only, shorthand
         * for [TextLine.firstNonWhitespaceCharacterIndex](#TextLine.firstNonWhitespaceCharacterIndex) === [TextLine.text.length](#TextLine.text).
         */
        readonly isEmptyOrWhitespace: boolean;
    }

    /**
     * Represents an end of line character sequence in a [document](#TextDocument).
     */
    export enum EndOfLine {
        /**
         * The line feed `\n` character.
         */
        LF = 1,
        /**
         * The carriage return line feed `\r\n` sequence.
         */
        CRLF = 2
    }

    /**
     * A universal resource identifier representing either a file on disk
     * or another resource, like untitled resources.
     */
    export class Uri {

        /**
         * Create an URI from a file system path. The [scheme](#Uri.scheme)
         * will be `file`.
         *
         * @param path A file system or UNC path.
         * @return A new Uri instance.
         */
        static file(path: string): Uri;

        /**
         * Create an URI from a string. Will throw if the given value is not
         * valid.
         *
         * @param value The string value of an Uri.
         * @return A new Uri instance.
         */
        static parse(value: string): Uri;

        /**
         * Use the `file` and `parse` factory functions to create new `Uri` objects.
         */
        private constructor(scheme: string, authority: string, path: string, query: string, fragment: string);

        /**
         * Scheme is the `http` part of `http://www.msft.com/some/path?query#fragment`.
         * The part before the first colon.
         */
        readonly scheme: string;

        /**
         * Authority is the `www.msft.com` part of `http://www.msft.com/some/path?query#fragment`.
         * The part between the first double slashes and the next slash.
         */
        readonly authority: string;

        /**
         * Path is the `/some/path` part of `http://www.msft.com/some/path?query#fragment`.
         */
        readonly path: string;

        /**
         * Query is the `query` part of `http://www.msft.com/some/path?query#fragment`.
         */
        readonly query: string;

        /**
         * Fragment is the `fragment` part of `http://www.msft.com/some/path?query#fragment`.
         */
        readonly fragment: string;

        /**
         * The string representing the corresponding file system path of this Uri.
         *
         * Will handle UNC paths and normalize windows drive letters to lower-case. Also
         * uses the platform specific path separator. Will *not* validate the path for
         * invalid characters and semantics. Will *not* look at the scheme of this Uri.
         */
        readonly fsPath: string;

        /**
         * Derive a new Uri from this Uri.
         *
         * ```ts
         * let file = Uri.parse('before:some/file/path');
         * let other = file.with({ scheme: 'after' });
         * assert.ok(other.toString() === 'after:some/file/path');
         * ```
         *
         * @param change An object that describes a change to this Uri. To unset components use `null` or
         *  the empty string.
         * @return A new Uri that reflects the given change. Will return `this` Uri if the change
         *  is not changing anything.
         */
        with(change: { scheme?: string; authority?: string; path?: string; query?: string; fragment?: string }): Uri;

        /**
         * Returns a string representation of this Uri. The representation and normalization
         * of a URI depends on the scheme. The resulting string can be safely used with
         * [Uri.parse](#Uri.parse).
         *
         * @param skipEncoding Do not percentage-encode the result, defaults to `false`. Note that
         *  the `#` and `?` characters occuring in the path will always be encoded.
         * @returns A string representation of this Uri.
         */
        toString(skipEncoding?: boolean): string;

        /**
         * Returns a JSON representation of this Uri.
         *
         * @return An object.
         */
        toJSON(): any;
    }

    /**
     * Represents a text document, such as a source file. Text documents have
     * [lines](#TextLine) and knowledge about an underlying resource like a file.
     */
    export interface TextDocument {
        /**
         * The associated uri for this document.
         *
         * *Note* that most documents use the `file`-scheme, which means they are files on disk. However, **not** all documents are
         * saved on disk and therefore the `scheme` must be checked before trying to access the underlying file or siblings on disk.
         *
         * @see [FileSystemProvider](#FileSystemProvider)
         * @see [TextDocumentContentProvider](#TextDocumentContentProvider)
         */
        readonly uri: Uri;

        /**
         * The file system path of the associated resource. Shorthand
         * notation for [TextDocument.uri.fsPath](#TextDocument.uri). Independent of the uri scheme.
         */
        readonly fileName: string;

        /**
         * Is this document representing an untitled file which has never been saved yet. *Note* that
         * this does not mean the document will be saved to disk, use [`uri.scheme`](#Uri.scheme)
         * to figure out where a document will be [saved](#FileSystemProvider), e.g. `file`, `ftp` etc.
         */
        readonly isUntitled: boolean;

        /**
         * The identifier of the language associated with this document.
         */
        readonly languageId: string;

        /**
         * The version number of this document (it will strictly increase after each
         * change, including undo/redo).
         */
        readonly version: number;

        /**
         * `true` if there are unpersisted changes.
         */
        readonly isDirty: boolean;

        /**
         * `true` if the document have been closed. A closed document isn't synchronized anymore
         * and won't be re-used when the same resource is opened again.
         */
        readonly isClosed: boolean;

        /**
         * Save the underlying file.
         *
         * @return A promise that will resolve to true when the file
         * has been saved. If the file was not dirty or the save failed,
         * will return false.
         */
        save(): Promise<boolean>;

        /**
         * The [end of line](#EndOfLine) sequence that is predominately
         * used in this document.
         */
        readonly eol: EndOfLine;

        /**
         * The number of lines in this document.
         */
        readonly lineCount: number;

        /**
         * Returns a text line denoted by the line number. Note
         * that the returned object is *not* live and changes to the
         * document are not reflected.
         *
         * @param line A line number in [0, lineCount).
         * @return A [line](#TextLine).
         */
        lineAt(line: number): TextLine;

        /**
         * Returns a text line denoted by the position. Note
         * that the returned object is *not* live and changes to the
         * document are not reflected.
         *
         * The position will be [adjusted](#TextDocument.validatePosition).
         *
         * @see [TextDocument.lineAt](#TextDocument.lineAt)
         * @param position A position.
         * @return A [line](#TextLine).
         */
        lineAt(position: Position): TextLine;

        /**
         * Converts the position to a zero-based offset.
         *
         * The position will be [adjusted](#TextDocument.validatePosition).
         *
         * @param position A position.
         * @return A valid zero-based offset.
         */
        offsetAt(position: Position): number;

        /**
         * Converts a zero-based offset to a position.
         *
         * @param offset A zero-based offset.
         * @return A valid [position](#Position).
         */
        positionAt(offset: number): Position;

        /**
         * Get the text of this document. A substring can be retrieved by providing
         * a range. The range will be [adjusted](#TextDocument.validateRange).
         *
         * @param range Include only the text included by the range.
         * @return The text inside the provided range or the entire text.
         */
        getText(range?: Range): string;

        /**
         * Get a word-range at the given position. By default words are defined by
         * common separators, like space, -, _, etc. In addition, per languge custom
         * [word definitions](#LanguageConfiguration.wordPattern) can be defined. It
         * is also possible to provide a custom regular expression.
         *
         * * *Note 1:* A custom regular expression must not match the empty string and
         * if it does, it will be ignored.
         * * *Note 2:* A custom regular expression will fail to match multiline strings
         * and in the name of speed regular expressions should not match words with
         * spaces. Use [`TextLine.text`](#TextLine.text) for more complex, non-wordy, scenarios.
         *
         * The position will be [adjusted](#TextDocument.validatePosition).
         *
         * @param position A position.
         * @param regex Optional regular expression that describes what a word is.
         * @return A range spanning a word, or `undefined`.
         */
        getWordRangeAtPosition(position: Position, regex?: RegExp): Range | undefined;

        /**
         * Ensure a range is completely contained in this document.
         *
         * @param range A range.
         * @return The given range or a new, adjusted range.
         */
        validateRange(range: Range): Range;

        /**
         * Ensure a position is contained in the range of this document.
         *
         * @param position A position.
         * @return The given position or a new, adjusted position.
         */
        validatePosition(position: Position): Position;
    }

    /**
     * Represents reasons why a text document is saved.
     */
    export enum TextDocumentSaveReason {

        /**
         * Manually triggered, e.g. by the user pressing save, by starting debugging,
         * or by an API call.
         */
        Manual = 1,

        /**
         * Automatic after a delay.
         */
        AfterDelay = 2,

        /**
         * When the editor lost focus.
         */
        FocusOut = 3
    }

    /**
     * An event that is fired when a [document](#TextDocument) will be saved.
     *
     * To make modifications to the document before it is being saved, call the
     * [`waitUntil`](#TextDocumentWillSaveEvent.waitUntil)-function with a thenable
     * that resolves to an array of [text edits](#TextEdit).
     */
    export interface TextDocumentWillSaveEvent {

        /**
         * The document that will be saved.
         */
        document: TextDocument;

        /**
         * The reason why save was triggered.
         */
        reason: TextDocumentSaveReason;

        /**
         * Allows to pause the event loop and to apply [pre-save-edits](#TextEdit).
         * Edits of subsequent calls to this function will be applied in order. The
         * edits will be *ignored* if concurrent modifications of the document happened.
         *
         * *Note:* This function can only be called during event dispatch and not
         * in an asynchronous manner:
         *
         * ```ts
         * workspace.onWillSaveTextDocument(event => {
         *  // async, will *throw* an error
         *  setTimeout(() => event.waitUntil(promise));
         *
         *  // sync, OK
         *  event.waitUntil(promise);
         * })
         * ```
         *
         * @param thenable A thenable that resolves to [pre-save-edits](#TextEdit).
         */
        waitUntil(thenable: PromiseLike<TextEdit[]>): void;

        /**
         * Allows to pause the event loop until the provided thenable resolved.
         *
         * *Note:* This function can only be called during event dispatch.
         *
         * @param thenable A thenable that delays saving.
         */
        waitUntil(thenable: PromiseLike<any>): void;
    }

    export interface TextDocumentChangeEvent {
        document: TextDocument;

        contentChanges: TextDocumentContentChangeEvent[];
    }

    export interface TextDocumentContentChangeEvent {
        range: Range;
        /**
         * The offset of the range that got replaced.
         */
        rangeOffset: number;
        /**
         * The length of the range that got replaced.
         */
        rangeLength: number;
        /**
         * The new text for the range.
         */
        text: string;
    }

    /**
     * Rendering style of the cursor.
     */
    export enum TextEditorCursorStyle {
        /**
         * Render the cursor as a vertical thick line.
         */
        Line = 1,
        /**
         * Render the cursor as a block filled.
         */
        Block = 2,
        /**
         * Render the cursor as a thick horizontal line.
         */
        Underline = 3,
        /**
         * Render the cursor as a vertical thin line.
         */
        LineThin = 4,
        /**
         * Render the cursor as a block outlined.
         */
        BlockOutline = 5,
        /**
         * Render the cursor as a thin horizontal line.
         */
        UnderlineThin = 6
    }

    /**
     * Rendering style of the line numbers.
     */
    export enum TextEditorLineNumbersStyle {
        /**
         * Do not render the line numbers.
         */
        Off = 0,
        /**
         * Render the line numbers.
         */
        On = 1,
        /**
         * Render the line numbers with values relative to the primary cursor location.
         */
        Relative = 2
    }

    /**
     * Represents a text editor's options
     */
    export interface TextEditorOptions {
        /**
         * The size in spaces a tab takes. This is used for two purposes:
         *  - the rendering width of a tab character;
         *  - the number of spaces to insert when [insertSpaces](#TextEditorOptions.insertSpaces) is true.
         *
         * When getting a text editor's options, this property will always be a number (resolved).
         * When setting a text editor's options, this property is optional and it can be a number or `"auto"`.
         */
        tabSize?: number | string;

        /**
         * When pressing Tab insert [n](#TextEditorOptions.tabSize) spaces.
         * When getting a text editor's options, this property will always be a boolean (resolved).
         * When setting a text editor's options, this property is optional and it can be a boolean or `"auto"`.
         */
        insertSpaces?: boolean | string;

        /**
         * The rendering style of the cursor in this editor.
         * When getting a text editor's options, this property will always be present.
         * When setting a text editor's options, this property is optional.
         */
        cursorStyle?: TextEditorCursorStyle;

        /**
         * Render relative line numbers w.r.t. the current line number.
         * When getting a text editor's options, this property will always be present.
         * When setting a text editor's options, this property is optional.
         */
        lineNumbers?: TextEditorLineNumbersStyle;
    }

    /**
     * Denotes a location of an editor in the window. Editors can be arranged in a grid
     * and each column represents one editor location in that grid by counting the editors
     * in order of their appearance.
     */
    export enum ViewColumn {
        /**
         * A *symbolic* editor column representing the currently active column. This value
         * can be used when opening editors, but the *resolved* [viewColumn](#TextEditor.viewColumn)-value
         * of editors will always be `One`, `Two`, `Three`,... or `undefined` but never `Active`.
         */
        Active = -1,
        /**
         * A *symbolic* editor column representing the column to the side of the active one. This value
         * can be used when opening editors, but the *resolved* [viewColumn](#TextEditor.viewColumn)-value
         * of editors will always be `One`, `Two`, `Three`,... or `undefined` but never `Beside`.
         */
        Beside = -2,
        /**
         * The first editor column.
         */
        One = 1,
        /**
         * The second editor column.
         */
        Two = 2,
        /**
         * The third editor column.
         */
        Three = 3,
        /**
         * The fourth editor column.
         */
        Four = 4,
        /**
         * The fifth editor column.
         */
        Five = 5,
        /**
         * The sixth editor column.
         */
        Six = 6,
        /**
         * The seventh editor column.
         */
        Seven = 7,
        /**
         * The eighth editor column.
         */
        Eight = 8,
        /**
         * The ninth editor column.
         */
        Nine = 9
    }

    /**
     * Represents a typed event.
     */
    export interface Event<T> {

        /**
         *
         * @param listener The listener function will be call when the event happens.
         * @param thisArgs The 'this' which will be used when calling the event listener.
         * @param disposables An array to which a {{IDisposable}} will be added.
         * @return a disposable to remove the listener again.
         */
        (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
    }

    /**
     * An event emitter used to create and fire an [event](#Event) or to subscribe to.
     */
    export class EventEmitter<T> {
        /**
         * The event listeners can subscribe to
         */
        event: Event<T>;

        /**
         * Fire the event and pass data object
         * @param data
         */
        fire(data?: T): void;

        /**
         * Dispose this object
         */
        dispose(): void;
    }

    /**
     * A file system watcher notifies about changes to files and folders
     * on disk.
     *
     * To get an instance of a `FileSystemWatcher` use
     * [createFileSystemWatcher](#workspace.createFileSystemWatcher).
     */
    export interface FileSystemWatcher extends Disposable {

        /**
         * true if this file system watcher has been created such that
         * it ignores creation file system events.
         */
        ignoreCreateEvents: boolean;

        /**
         * true if this file system watcher has been created such that
         * it ignores change file system events.
         */
        ignoreChangeEvents: boolean;

        /**
         * true if this file system watcher has been created such that
         * it ignores delete file system events.
         */
        ignoreDeleteEvents: boolean;

        /**
         * An event which fires on file/folder creation.
         */
        onDidCreate: Event<Uri>;

        /**
         * An event which fires on file/folder change.
         */
        onDidChange: Event<Uri>;

        /**
         * An event which fires on file/folder deletion.
         */
        onDidDelete: Event<Uri>;
    }

    /**
     * A cancellation token used to request cancellation on long running
     * or asynchronous task.
     */
    export interface CancellationToken {
        readonly isCancellationRequested: boolean;
        /*
         * An event emitted when cancellation is requested
         * @event
         */
        readonly onCancellationRequested: Event<any>;

    }

    /**
     * A cancellation token source create and manage a [cancellation token](#CancellationToken)
     */
    export class CancellationTokenSource {
        token: CancellationToken;
        cancel(): void;
        dispose(): void;
    }

    /**
     * A text document content provider allows to add readonly documents
     * to the editor, such as source from a dll or generated html from md.
     *
     * Content providers are [registered](#workspace.registerTextDocumentContentProvider)
     * for a [uri-scheme](#Uri.scheme). When a uri with that scheme is to
     * be [loaded](#workspace.openTextDocument) the content provider is
     * asked.
     */
    export interface TextDocumentContentProvider {

        /**
         * An event to signal a resource has changed.
         */
        onDidChange?: Event<Uri>;

        /**
         * Provide textual content for a given uri.
         *
         * The editor will use the returned string-content to create a readonly
         * [document](#TextDocument). Resources allocated should be released when
         * the corresponding document has been [closed](#workspace.onDidCloseTextDocument).
         *
         * @param uri An uri which scheme matches the scheme this provider was [registered](#workspace.registerTextDocumentContentProvider) for.
         * @param token A cancellation token.
         * @return A string or a thenable that resolves to such.
         */
        provideTextDocumentContent(uri: Uri, token: CancellationToken): ProviderResult<string>;
    }

    /**
     * A light-weight user input UI that is initially not visible. After
     * configuring it through its properties the extension can make it
     * visible by calling [QuickInput.show](#QuickInput.show).
     *
     * There are several reasons why this UI might have to be hidden and
     * the extension will be notified through [QuickInput.onDidHide](#QuickInput.onDidHide).
     * (Examples include: an explicit call to [QuickInput.hide](#QuickInput.hide),
     * the user pressing Esc, some other input UI opening, etc.)
     *
     * A user pressing Enter or some other gesture implying acceptance
     * of the current state does not automatically hide this UI component.
     * It is up to the extension to decide whether to accept the user's input
     * and if the UI should indeed be hidden through a call to [QuickInput.hide](#QuickInput.hide).
     *
     * When the extension no longer needs this input UI, it should
     * [QuickInput.dispose](#QuickInput.dispose) it to allow for freeing up
     * any resources associated with it.
     *
     * See [QuickPick](#QuickPick) and [InputBox](#InputBox) for concrete UIs.
     */
    export interface QuickInput {

        /**
         * An optional title.
         */
        title: string | undefined;

        /**
         * An optional current step count.
         */
        step: number | undefined;

        /**
         * An optional total step count.
         */
        totalSteps: number | undefined;

        /**
         * If the UI should allow for user input. Defaults to true.
         *
         * Change this to false, e.g., while validating user input or
         * loading data for the next step in user input.
         */
        enabled: boolean;

        /**
         * If the UI should show a progress indicator. Defaults to false.
         *
         * Change this to true, e.g., while loading more data or validating
         * user input.
         */
        busy: boolean;

        /**
         * If the UI should stay open even when loosing UI focus. Defaults to false.
         */
        ignoreFocusOut: boolean;

        /**
         * Makes the input UI visible in its current configuration. Any other input
         * UI will first fire an [QuickInput.onDidHide](#QuickInput.onDidHide) event.
         */
        show(): void;

        /**
         * Hides this input UI. This will also fire an [QuickInput.onDidHide](#QuickInput.onDidHide)
         * event.
         */
        hide(): void;

        /**
         * An event signaling when this input UI is hidden.
         *
         * There are several reasons why this UI might have to be hidden and
         * the extension will be notified through [QuickInput.onDidHide](#QuickInput.onDidHide).
         * (Examples include: an explicit call to [QuickInput.hide](#QuickInput.hide),
         * the user pressing Esc, some other input UI opening, etc.)
         */
        onDidHide: Event<void>;

        /**
         * Dispose of this input UI and any associated resources. If it is still
         * visible, it is first hidden. After this call the input UI is no longer
         * functional and no additional methods or properties on it should be
         * accessed. Instead a new input UI should be created.
         */
        dispose(): void;
    }

    /**
     * Something that can be selected from a list of items.
     */
    export interface QuickPickItem {

        /**
         * The item label
         */
        label: string;

        /**
         * The item description
         */
        description?: string;

        /**
         * The item detail
         */
        detail?: string;

        /**
         * Used for [QuickPickOptions.canPickMany](#QuickPickOptions.canPickMany)
         * not implemented yet
         */
        picked?: boolean;
    }

    /**
     * Button for an action in a [QuickPick](#QuickPick) or [InputBox](#InputBox).
     */
    export interface QuickInputButton {

        /**
         * Icon for the button.
         */
        readonly iconPath: Uri | { light: Uri; dark: Uri } | ThemeIcon;

        /**
         * An optional tooltip.
         */
        readonly tooltip?: string | undefined;
    }

    /**
     * A concrete [QuickInput](#QuickInput) to let the user pick an item from a
     * list of items of type T. The items can be filtered through a filter text field and
     * there is an option [canSelectMany](#QuickPick.canSelectMany) to allow for
     * selecting multiple items.
     *
     * Note that in many cases the more convenient [window.showQuickPick](#window.showQuickPick)
     * is easier to use. [window.createQuickPick](#window.createQuickPick) should be used
     * when [window.showQuickPick](#window.showQuickPick) does not offer the required flexibility.
     */
    export interface QuickPick<T extends QuickPickItem> extends QuickInput {

        /**
         * Current value of the filter text.
         */
        value: string;

        /**
         * Optional placeholder in the filter text.
         */
        placeholder: string | undefined;

        /**
         * An event signaling when the value of the filter text has changed.
         */
        readonly onDidChangeValue: Event<string>;

        /**
         * An event signaling when the user indicated acceptance of the selected item(s).
         */
        readonly onDidAccept: Event<void>;

        /**
         * Buttons for actions in the UI.
         */
        buttons: ReadonlyArray<QuickInputButton>;

        /**
         * An event signaling when a button was triggered.
         */
        readonly onDidTriggerButton: Event<QuickInputButton>;

        /**
         * Items to pick from.
         */
        items: ReadonlyArray<T>;

        /**
         * If multiple items can be selected at the same time. Defaults to false.
         */
        canSelectMany: boolean;

        /**
         * If the filter text should also be matched against the description of the items. Defaults to false.
         */
        matchOnDescription: boolean;

        /**
         * If the filter text should also be matched against the detail of the items. Defaults to false.
         */
        matchOnDetail: boolean;

        /**
         * Active items. This can be read and updated by the extension.
         */
        activeItems: ReadonlyArray<T>;

        /**
         * An event signaling when the active items have changed.
         */
        readonly onDidChangeActive: Event<T[]>;

        /**
         * Selected items. This can be read and updated by the extension.
         */
        selectedItems: ReadonlyArray<T>;

        /**
         * An event signaling when the selected items have changed.
         */
        readonly onDidChangeSelection: Event<T[]>;
    }

    /**
     * Options for configuration behavior of the quick pick
     */
    export interface QuickPickOptions {
        /**
         * A flag to include the description when filtering
         */
        matchOnDescription?: boolean;

        /**
         *  A flag to include the detail when filtering
         */
        matchOnDetail?: boolean;

        /**
         * The place holder in input box
         */
        placeHolder?: string;

        /**
         * If `true` prevent picker closing when it's loses focus
         */
        ignoreFocusOut?: boolean;

        /**
         * If `true` make picker accept multiple selections.
         * Not implemented yet
         */
        canPickMany?: boolean;

        /**
         * Function that is invoked when item selected
         */
        onDidSelectItem?(item: QuickPickItem | string): any;
    }

    /**
     * Options to configure the behaviour of the [workspace folder](#WorkspaceFolder) pick UI.
     */
    export interface WorkspaceFolderPickOptions {

        /**
         * An optional string to show as place holder in the input box to guide the user what to pick on.
         */
        placeHolder?: string;

        /**
         * Set to `true` to keep the picker open when focus moves to another part of the editor or to another window.
         */
        ignoreFocusOut?: boolean;
    }

    /**
     * Options to configure the behavior of the input box UI.
     */
    export interface InputBoxOptions {

        /**
         * The value to prefill in the input box.
         */
        value?: string;

        /**
         * Selection of the prefilled [`value`](#InputBoxOptions.value). Defined as tuple of two number where the
         * first is the inclusive start index and the second the exclusive end index. When `undefined` the whole
         * word will be selected, when empty (start equals end) only the cursor will be set,
         * otherwise the defined range will be selected.
         */
        valueSelection?: [number, number];

        /**
         * The text to display underneath the input box.
         */
        prompt?: string;

        /**
         * An optional string to show as place holder in the input box to guide the user what to type.
         */
        placeHolder?: string;

        /**
         * Set to `true` to show a password prompt that will not show the typed value.
         */
        password?: boolean;

        /**
         * Set to `true` to keep the input box open when focus moves to another part of the editor or to another window.
         */
        ignoreFocusOut?: boolean;

        /**
         * An optional function that will be called to validate input and to give a hint
         * to the user.
         *
         * @param value The current value of the input box.
         * @return A human readable string which is presented as diagnostic message.
         * Return `undefined`, or the empty string when 'value' is valid.
         */
        validateInput?(value: string): string | undefined | PromiseLike<string | undefined>;
    }

    /**
     * Namespace for dealing with commands. In short, a command is a function with a
     * unique identifier. The function is sometimes also called _command handler_.
     *
     * Commands can be added using the [registerCommand](#commands.registerCommand) and
     * [registerTextEditorCommand](#commands.registerTextEditorCommand) functions.
     * Registration can be split in two step: first register command without handler,
     * second register handler by command id.
     *
     * Any contributed command are available to any plugin, command can be invoked
     * by [executeCommand](#commands.executeCommand) function.
     *
     * Simple example that register command:
     * ```javascript
     * theia.commands.registerCommand({id:'say.hello.command'}, ()=>{
     *     console.log("Hello World!");
     * });
     * ```
     *
     * Simple example that invoke command:
     *
     * ```javascript
     * theia.commands.executeCommand('core.about');
     * ```
     */
    export namespace commands {
        /**
         * Register the given command and handler if present.
         *
         * Throw if a command is already registered for the given command identifier.
         */
        export function registerCommand(command: CommandDescription, handler?: (...args: any[]) => any, thisArg?: any): Disposable;

        /**
         * Register the given handler for the given command identifier.
         *
         * @param commandId a given command id
         * @param handler a command handler
         *
         * Throw if a handler for the given command identifier is already registered.
         */
        export function registerHandler(commandId: string, handler: (...args: any[]) => any, thisArg?: any): Disposable;

        /**
         * Registers a text editor command that can be invoked via a keyboard shortcut,
         * a menu item, an action, or directly.
         *
         * Text editor commands are different from ordinary [commands](#commands.registerCommand) as
         * they only execute when there is an active editor when the command is called. Also, the
         * command handler of an editor command has access to the active editor and to an
         * [edit](#TextEditorEdit)-builder.
         *
         * @param command A unique identifier for the command.
         * @param callback A command handler function with access to an [editor](#TextEditor) and an [edit](#TextEditorEdit).
         * @param thisArg The `this` context used when invoking the handler function.
         * @return Disposable which unregisters this command on disposal.
         */
        export function registerTextEditorCommand(command: string, callback: (textEditor: TextEditor, edit: TextEditorEdit, ...args: any[]) => void, thisArg?: any): Disposable;

        /**
         * Execute the active handler for the given command and arguments.
         *
         * Reject if a command cannot be executed.
         */
        export function executeCommand<T>(commandId: string, ...args: any[]): PromiseLike<T | undefined>;

        /**
         * Retrieve the list of all available commands. Commands starting an underscore are
         * treated as internal commands.
         *
         * @param filterInternal Set `true` to not see internal commands (starting with an underscore)
         * @return Thenable that resolves to a list of command ids.
         */
        export function getCommands(filterInternal?: boolean): PromiseLike<string[]>;
    }

    /**
     * Represents an action that is shown with a message.
     */
    export interface MessageItem {

        /**
         * A message title.
         */
        title: string;

        /**
         * Indicates that the item should be triggered
         * when the user cancels the dialog.
         *
         * Note: this option is ignored for non-modal messages.
         */
        isCloseAffordance?: boolean;
    }

    /**
     * Options to configure the message behavior.
     */
    export interface MessageOptions {

        /**
         * Indicates that this message should be modal.
         */
        modal?: boolean;
    }

    /**
     * Represents the alignment of status bar items.
     */
    export enum StatusBarAlignment {

        /**
         * Aligned to the left side.
         */
        Left = 1,

        /**
         * Aligned to the right side.
         */
        Right = 2
    }

    /**
     * A status bar item is a status bar contribution that can
     * show text and icons and run a command on click.
     */
    export interface StatusBarItem {

        /**
         * The alignment of this item.
         */
        readonly alignment: StatusBarAlignment;

        /**
         * The priority of this item. Higher value means the item should
         * be shown more to the left.
         */
        readonly priority: number;

        /**
         * The text to show for the entry. To set a text with icon use the following pattern in text string:
         * $(fontawesomeClassName)
         */
        text: string;

        /**
         * The tooltip text when you hover over this entry.
         */
        tooltip: string | undefined;

        /**
         * The foreground color for this entry.
         */
        color: string | ThemeColor | undefined;

        /**
         * The identifier of a command to run on click.
         */
        command: string | undefined;

        /**
         * Shows the entry in the status bar.
         */
        show(): void;

        /**
         * Hide the entry in the status bar.
         */
        hide(): void;

        /**
         * Dispose and free associated resources. Hide the entry in the status bar.
         */
        dispose(): void;
    }

    /**
     * A reference to one of the workbench colors.
     * Using a theme color is preferred over a custom color as it gives theme authors and users the possibility to change the color.
     */
    export class ThemeColor {
        /**
         * Creates a reference to a theme color.
         */
        constructor(id: string);
    }

    /**
     * A reference to a named icon. Currently only [File](#ThemeIcon.File) and [Folder](#ThemeIcon.Folder) are supported.
     * Using a theme icon is preferred over a custom icon as it gives theme authors the possibility to change the icons.
     */
    export class ThemeIcon {
        /**
         * Reference to a icon representing a file. The icon is taken from the current file icon theme or a placeholder icon.
         */
        static readonly File: ThemeIcon;

        /**
         * Reference to a icon representing a folder. The icon is taken from the current file icon theme or a placeholder icon.
         */
        static readonly Folder: ThemeIcon;

        private constructor(id: string);
    }

    /**
     * Represents the state of a window.
     */
    export interface WindowState {
        /**
         * Whether the current window is focused.
         */
        readonly focused: boolean;
    }

    /**
     * An output channel is a container for readonly textual information.
     */
    export interface OutputChannel {

        /**
         * The name of this output channel.
         */
        readonly name: string;

        /**
         * Append the given value to the channel.
         *
         * @param value
         */
        append(value: string): void;

        /**
         * Append the given value and a line feed character
         * to the channel.
         *
         * @param value
         */
        appendLine(value: string): void;

        /**
         * Removes all output from the channel.
         */
        clear(): void;

        /**
         * Reveal this channel in the UI.
         *
         * @param preserveFocus When 'true' the channel will not take focus.
         */
        show(preserveFocus?: boolean): void;

        /**
         * Hide this channel from the UI.
         */
        hide(): void;

        /**
         * Dispose and free associated resources.
         */
        dispose(): void;
    }

    /**
     * Options to configure the behaviour of a file open dialog.
     *
     * * Note 1: A dialog can select files, folders, or both. This is not true for Windows
     * which enforces to open either files or folder, but *not both*.
     * * Note 2: Explicitly setting `canSelectFiles` and `canSelectFolders` to `false` is futile
     * and the editor then silently adjusts the options to select files.
     */
    export interface OpenDialogOptions {
        /**
         * The resource the dialog shows when opened.
         */
        defaultUri?: Uri;

        /**
         * A human-readable string for the open button.
         */
        openLabel?: string;

        /**
         * Allow to select files, defaults to `true`.
         */
        canSelectFiles?: boolean;

        /**
         * Allow to select folders, defaults to `false`.
         */
        canSelectFolders?: boolean;

        /**
         * Allow to select many files or folders.
         */
        canSelectMany?: boolean;

        /**
         * A set of file filters that are used by the dialog. Each entry is a human readable label,
         * like "TypeScript", and an array of extensions, e.g.
         * ```ts
         * {
         *     'Images': ['png', 'jpg']
         *     'TypeScript': ['ts', 'tsx']
         * }
         * ```
         */
        filters?: { [name: string]: string[] };
    }

    /**
     * Options to configure the behaviour of a file save dialog.
     */
    export interface SaveDialogOptions {
        /**
         * The resource the dialog shows when opened.
         */
        defaultUri?: Uri;

        /**
         * A human-readable string for the save button.
         */
        saveLabel?: string;

        /**
         * A set of file filters that are used by the dialog. Each entry is a human readable label,
         * like "TypeScript", and an array of extensions, e.g.
         * ```ts
         * {
         *  'Images': ['png', 'jpg']
         *  'TypeScript': ['ts', 'tsx']
         * }
         * ```
         */
        filters?: { [name: string]: string[] };
    }

    /**
     * Definition of the terminal emulator.
     */
    export interface Terminal {
        /**
         * Human readable representation of the terminal in the UI.
         */
        readonly name: string;

        /**
         * Terminal id.
         */
        readonly processId: PromiseLike<number>;

        /**
         * Send text to the terminal.
         * @param text - text content.
         * @param addNewLine - in case true - apply new line after the text, otherwise don't apply new line. This defaults to `true`.
         */
        sendText(text: string, addNewLine?: boolean): void;

        /**
         * Show created terminal on the UI.
         * @param preserveFocus - in case true - set up focus on the terminal widget, otherwise show terminal without focus.
         */
        show(preserveFocus?: boolean): void;

        /**
         * Hide terminal panel.
         */
        hide(): void;

        /**
         * Destroy terminal.
         */
        dispose(): void;
    }

    /**
     * Options to create terminal widget.
     */
    export interface TerminalOptions {
        /**
         * Human readable representation of the terminal in the UI.
         */
        name?: string;

        /**
         * Path to the executable shell. For example "/bin/bash", "bash", "sh".
         */
        shellPath?: string;

        /**
         * Arguments to configure executable shell. For example ["-l"] - run shell without login.
         */
        shellArgs?: string[];

        /**
         * Current working directory.
         */
        cwd?: string;

        /**
         * Environment variables for terminal in format key - value.
         */
        env?: { [key: string]: string | null };

        /**
         * Terminal attributes. Can be useful to apply some implementation specific information.
         */
        attributes?: { [key: string]: string | null };
    }

    /**
     * A plug-in context is a collection of utilities private to a
     * plug-in.
     *
     * An instance of a `PluginContext` is provided as the first
     * parameter to the `start` of a plug-in.
     */
    export interface PluginContext {

        /**
         * An array to which disposables can be added. When this
         * extension is deactivated the disposables will be disposed.
         */
        subscriptions: { dispose(): any }[];

        /**
         * A memento object that stores state in the context
         * of the currently opened [workspace](#workspace.workspaceFolders).
         */
        workspaceState: Memento;

        /**
         * A memento object that stores state independent
         * of the current opened [workspace](#workspace.workspaceFolders).
         */
        globalState: Memento;

        /**
         * The absolute file path of the directory containing the extension.
         */
        extensionPath: string;

        /**
         * Get the absolute path of a resource contained in the extension.
         *
         * @param relativePath A relative path to a resource contained in the extension.
         * @return The absolute path of the resource.
         */
        asAbsolutePath(relativePath: string): string;

        /**
         * Return log path for current of the extension.
         */
        logPath: string;

        /**
        * An absolute file path of a workspace specific directory in which the extension
        * can store private state. The directory might not exist on disk and creation is
        * up to the extension. However, the parent directory is guaranteed to be existent.
        *
        * Use [`workspaceState`](#ExtensionContext.workspaceState) or
        * [`globalState`](#ExtensionContext.globalState) to store key value data.
        */
        storagePath: string | undefined;
    }

    /**
     * A memento represents a storage utility. It can store and retrieve
     * values.
     */
    export interface Memento {

        /**
         * Return a value.
         *
         * @param key A string.
         * @return The stored value or `undefined`.
         */
        get<T>(key: string): T | undefined;

        /**
         * Return a value.
         *
         * @param key A string.
         * @param defaultValue A value that should be returned when there is no
         * value (`undefined`) with the given key.
         * @return The stored value or the defaultValue.
         */
        get<T>(key: string, defaultValue: T): T;

        /**
         * Store a value. The value must be JSON-stringifyable.
         *
         * @param key A string.
         * @param value A value. MUST not contain cyclic references.
         */
        update(key: string, value: any): PromiseLike<void>;
    }

    /**
     * Content settings for a webview.
     */
    export interface WebviewOptions {
        /**
         * Controls whether scripts are enabled in the webview content or not.
         *
         * Defaults to false (scripts-disabled).
         */
        readonly enableScripts?: boolean;

        /**
         * Controls whether command uris are enabled in webview content or not.
         *
         * Defaults to false.
         */
        readonly enableCommandUris?: boolean;

        /**
         * Root paths from which the webview can load local (filesystem) resources using the `theia-resource:` scheme.
         *
         * Default to the root folders of the current workspace plus the extension's install directory.
         *
         * Pass in an empty array to disallow access to any local resources.
         */
        readonly localResourceRoots?: ReadonlyArray<Uri>;
    }

    /**
     * A webview displays html content, like an iframe.
     */
    export interface Webview {
        /**
         * Content settings for the webview.
         */
        options: WebviewOptions;

        /**
         * Contents of the webview.
         *
         * Should be a complete html document.
         */
        html: string;

        /**
         * Fired when the webview content posts a message.
         */
        readonly onDidReceiveMessage: Event<any>;

        /**
         * Post a message to the webview content.
         *
         * Messages are only delivered if the webview is visible.
         *
         * @param message Body of the message.
         */
        postMessage(message: any): PromiseLike<boolean>;
    }

    /**
     * Content settings for a webview panel.
     */
    export interface WebviewPanelOptions {
        /**
         * Controls if the find widget is enabled in the panel.
         *
         * Defaults to false.
         */
        readonly enableFindWidget?: boolean;

        /**
         * Controls if the webview panel's content (iframe) is kept around even when the panel
         * is no longer visible.
         *
         * Normally the webview panel's html context is created when the panel becomes visible
         * and destroyed when it is is hidden. Extensions that have complex state
         * or UI can set the `retainContextWhenHidden` to make Theia keep the webview
         * context around, even when the webview moves to a background tab. When a webview using
         * `retainContextWhenHidden` becomes hidden, its scripts and other dynamic content are suspended.
         * When the panel becomes visible again, the context is automatically restored
         * in the exact same state it was in originally. You cannot send messages to a
         * hidden webview, even with `retainContextWhenHidden` enabled.
         *
         * `retainContextWhenHidden` has a high memory overhead and should only be used if
         * your panel's context cannot be quickly saved and restored.
         */
        readonly retainContextWhenHidden?: boolean;
    }

    /**
     * The areas of the application shell where webview panel can reside.
     */
    export enum WebviewPanelTargetArea {
        Main = 'main',
        Left = 'left',
        Right = 'right',
        Bottom = 'bottom'
    }

    /**
     * Settings to determine where webview panel will be reside
     */
    export interface WebviewPanelShowOptions {
        /**
         * Target area where webview panel will be resided. Shows in the 'WebviewPanelTargetArea.Main' area if undefined.
         */
        area?: WebviewPanelTargetArea;

        /**
         * Editor View column to show the panel in. Shows in the current `viewColumn` if undefined.
         */
        viewColumn?: number;

        /**
         * When `true`, the webview will not take focus.
         */
        preserveFocus?: boolean;
    }

    /**
     * A panel that contains a webview.
     */
    interface WebviewPanel {
        /**
         * Identifies the type of the webview panel, such as `'markdown.preview'`.
         */
        readonly viewType: string;

        /**
         * Title of the panel shown in UI.
         */
        title: string;

        /**
         * Icon for the panel shown in UI.
         */
        iconPath?: Uri | { light: Uri; dark: Uri };

        /**
         * Webview belonging to the panel.
         */
        readonly webview: Webview;

        /**
         * Content settings for the webview panel.
         */
        readonly options: WebviewPanelOptions;

        /**
         * Settings to determine where webview panel will be reside
         */
        readonly showOptions?: WebviewPanelShowOptions;
        /**
         * Editor position of the panel. This property is only set if the webview is in
         * one of the editor view columns.
         */
        readonly viewColumn?: ViewColumn;

        /**
         * Whether the panel is active (focused by the user).
         */
        readonly active: boolean;

        /**
         * Whether the panel is visible.
         */
        readonly visible: boolean;

        /**
         * Fired when the panel's view state changes.
         */
        readonly onDidChangeViewState: Event<WebviewPanelOnDidChangeViewStateEvent>;

        /**
         * Fired when the panel is disposed.
         *
         * This may be because the user closed the panel or because `.dispose()` was
         * called on it.
         *
         * Trying to use the panel after it has been disposed throws an exception.
         */
        readonly onDidDispose: Event<void>;

        /**
         * Show the webview panel in a given column.
         *
         * A webview panel may only show in a single column at a time. If it is already showing, this
         * method moves it to a new column.
         *
         * @param viewColumn View column to show the panel in. Shows in the current `viewColumn` if undefined.
         * @param preserveFocus When `true`, the webview will not take focus.
         */
        reveal(viewColumn?: ViewColumn, preserveFocus?: boolean): void;

        /**
         * Show the webview panel according to a given options.
         *
         * A webview panel may only show in a single column at a time. If it is already showing, this
         * method moves it to a new column.
         *
         * @param area target area where webview panel will be resided. Shows in the 'WebviewPanelTargetArea.Main' area if undefined.
         * @param viewColumn View column to show the panel in. Shows in the current `viewColumn` if undefined.
         * @param preserveFocus When `true`, the webview will not take focus.
         */
        reveal(area?: WebviewPanelTargetArea, viewColumn?: ViewColumn, preserveFocus?: boolean): void;

        /**
         * Dispose of the webview panel.
         *
         * This closes the panel if it showing and disposes of the resources owned by the webview.
         * Webview panels are also disposed when the user closes the webview panel. Both cases
         * fire the `onDispose` event.
         */
        dispose(): void;
    }

    /**
     * Event fired when a webview panel's view state changes.
     */
    export interface WebviewPanelOnDidChangeViewStateEvent {
        /**
         * Webview panel whose view state changed.
         */
        readonly webviewPanel: WebviewPanel;
    }

    /**
     * Restore webview panels that have been persisted when vscode shuts down.
     *
     * There are two types of webview persistence:
     *
     * - Persistence within a session.
     * - Persistence across sessions (across restarts of Theia).
     *
     * A `WebviewPanelSerializer` is only required for the second case: persisting a webview across sessions.
     *
     * Persistence within a session allows a webview to save its state when it becomes hidden
     * and restore its content from this state when it becomes visible again. It is powered entirely
     * by the webview content itself. To save off a persisted state, call `acquireVsCodeApi().setState()` with
     * any json serializable object. To restore the state again, call `getState()`
     *
     * ```js
     * // Within the webview
     * const vscode = acquireVsCodeApi();
     *
     * // Get existing state
     * const oldState = vscode.getState() || { value: 0 };
     *
     * // Update state
     * setState({ value: oldState.value + 1 })
     * ```
     *
     * A `WebviewPanelSerializer` extends this persistence across restarts of Theia. When the editor is shutdown,
     * Theia will save off the state from `setState` of all webviews that have a serializer. When the
     * webview first becomes visible after the restart, this state is passed to `deserializeWebviewPanel`.
     * The extension can then restore the old `WebviewPanel` from this state.
     */
    interface WebviewPanelSerializer {
        /**
         * Restore a webview panel from its seriailzed `state`.
         *
         * Called when a serialized webview first becomes visible.
         *
         * @param webviewPanel Webview panel to restore. The serializer should take ownership of this panel. The
         * serializer must restore the webview's `.html` and hook up all webview events.
         * @param state Persisted state from the webview content.
         *
         * @return PromiseLike indicating that the webview has been fully restored.
         */
        deserializeWebviewPanel(webviewPanel: WebviewPanel, state: any): PromiseLike<void>;
    }

    /**
     * A uri handler is responsible for handling system-wide [uris](#Uri).
     *
     * @see [window.registerUriHandler](#window.registerUriHandler).
     */
    export interface UriHandler {

        /**
         * Handle the provided system-wide [uri](#Uri).
         *
         * @see [window.registerUriHandler](#window.registerUriHandler).
         */
        handleUri(uri: Uri): ProviderResult<void>;
    }

    /**
     * Common namespace for dealing with window and editor, showing messages and user input.
     */
    export namespace window {

        /**
         * The currently active terminal or undefined. The active terminal is the one
         * that currently has focus or most recently had focus.
         */
        export let activeTerminal: Terminal | undefined;

        /**
         * The currently active editor or `undefined`. The active editor is the one
         * that currently has focus or, when none has focus, the one that has changed
         * input most recently.
         */
        export let activeTextEditor: TextEditor | undefined;

        /**
         * The currently opened terminals or an empty array.
         */
        export let terminals: ReadonlyArray<Terminal>;

        /**
         * The currently visible editors or an empty array.
         */
        export let visibleTextEditors: TextEditor[];

        /**
         * An [event](#Event) which fires when the [active terminal](#window.activeTerminal) has changed.
         * *Note* that the event also fires when the active terminal changes to `undefined`.
         */
        export const onDidChangeActiveTerminal: Event<Terminal | undefined>;

        /**
         * An [event](#Event) which fires when the [active editor](#window.activeTextEditor)
         * has changed. *Note* that the event also fires when the active editor changes
         * to `undefined`.
         */
        export const onDidChangeActiveTextEditor: Event<TextEditor | undefined>;

        /**
         * An [event](#Event) which fires when the array of [visible editors](#window.visibleTextEditors)
         * has changed.
         */
        export const onDidChangeVisibleTextEditors: Event<TextEditor[]>;

        /**
         * An [event](#Event) which fires when the selection in an editor has changed.
         */
        export const onDidChangeTextEditorSelection: Event<TextEditorSelectionChangeEvent>;

        /**
         * An [event](#Event) which fires when the selection in an editor has changed.
         */
        export const onDidChangeTextEditorVisibleRanges: Event<TextEditorVisibleRangesChangeEvent>;

        /**
         * An [event](#Event) which fires when the options of an editor have changed.
         */
        export const onDidChangeTextEditorOptions: Event<TextEditorOptionsChangeEvent>;

        /**
         * An [event](#Event) which fires when the view column of an editor has changed.
         */
        export const onDidChangeTextEditorViewColumn: Event<TextEditorViewColumnChangeEvent>;

        /**
         * Show the given document in a text editor. A [column](#ViewColumn) can be provided
         * to control where the editor is being shown. Might change the [active editor](#window.activeTextEditor).
         *
         * @param document A text document to be shown.
         * @param column A view column in which the [editor](#TextEditor) should be shown. The default is the [active](#ViewColumn.Active), other values
         * are adjusted to be `Min(column, columnCount + 1)`, the [active](#ViewColumn.Active)-column is not adjusted. Use [`ViewColumn.Beside`](#ViewColumn.Beside)
         * to open the editor to the side of the currently active one.
         * @param preserveFocus When `true` the editor will not take focus.
         * @return A promise that resolves to an [editor](#TextEditor).
         */
        export function showTextDocument(document: TextDocument, column?: ViewColumn, preserveFocus?: boolean): PromiseLike<TextEditor>;

        /**
         * Show the given document in a text editor. [Options](#TextDocumentShowOptions) can be provided
         * to control options of the editor is being shown. Might change the [active editor](#window.activeTextEditor).
         *
         * @param document A text document to be shown.
         * @param options [Editor options](#TextDocumentShowOptions) to configure the behavior of showing the [editor](#TextEditor).
         * @return A promise that resolves to an [editor](#TextEditor).
         */
        export function showTextDocument(document: TextDocument, options?: TextDocumentShowOptions): PromiseLike<TextEditor>;

        /**
         * A short-hand for `openTextDocument(uri).then(document => showTextDocument(document, options))`.
         *
         * @see [openTextDocument](#openTextDocument)
         *
         * @param uri A resource identifier.
         * @param options [Editor options](#TextDocumentShowOptions) to configure the behavior of showing the [editor](#TextEditor).
         * @return A promise that resolves to an [editor](#TextEditor).
         */
        export function showTextDocument(uri: Uri, options?: TextDocumentShowOptions): PromiseLike<TextEditor>;

        /**
         * Shows a selection list.
         * @param items
         * @param options
         * @param token
         */
        export function showQuickPick(items: string[] | PromiseLike<string[]>, options: QuickPickOptions, token?: CancellationToken): PromiseLike<string | undefined>;

        /**
         * Shows a selection list with multiple selection allowed.
         */
        export function showQuickPick(
            items: string[] | PromiseLike<string[]>,
            options: QuickPickOptions & { canPickMany: true },
            token?: CancellationToken
        ): PromiseLike<string[] | undefined>;

        /**
         * Shows a selection list.
         * @param items
         * @param options
         * @param token
         */
        export function showQuickPick<T extends QuickPickItem>(items: T[] | PromiseLike<T[]>, options: QuickPickOptions, token?: CancellationToken): PromiseLike<T | undefined>;

        /**
         * Shows a selection list with multiple selection allowed.
         */
        export function showQuickPick<T extends QuickPickItem>(items: T[] | PromiseLike<T[]>,
            options: QuickPickOptions & { canPickMany: true },
            token?: CancellationToken
        ): PromiseLike<T[] | undefined>;

        /**
         * Creates a [QuickPick](#QuickPick) to let the user pick an item from a list
         * of items of type T.
         *
         * Note that in many cases the more convenient [window.showQuickPick](#window.showQuickPick)
         * is easier to use. [window.createQuickPick](#window.createQuickPick) should be used
         * when [window.showQuickPick](#window.showQuickPick) does not offer the required flexibility.
         *
         * @return A new [QuickPick](#QuickPick).
         */
        export function createQuickPick<T extends QuickPickItem>(): QuickPick<T>;

        /**
         * Shows a selection list of [workspace folders](#workspace.workspaceFolders) to pick from.
         * Returns `undefined` if no folder is open.
         *
         * @param options Configures the behavior of the workspace folder list.
         * @return A promise that resolves to the workspace folder or `undefined`.
         */
        export function showWorkspaceFolderPick(options?: WorkspaceFolderPickOptions): PromiseLike<WorkspaceFolder | undefined>;

        /**
         * Show an information message.
         *
         * @param message a message to show.
         * @param items A set of items that will be rendered as actions in the message.
         * @return A promise that resolves to the selected item or `undefined` when being dismissed.
         */
        export function showInformationMessage(message: string, ...items: string[]): PromiseLike<string | undefined>;

        /**
         * Show an information message.
         *
         * @param message a message to show.
         * @param options Configures the behaviour of the message.
         * @param items A set of items that will be rendered as actions in the message.
         * @return A promise that resolves to the selected item or `undefined` when being dismissed.
         */
        export function showInformationMessage(message: string, options: MessageOptions, ...items: string[]): PromiseLike<string | undefined>;

        /**
         * Show an information message.
         *
         * @param message a message to show.
         * @param items A set of items that will be rendered as actions in the message.
         * @return A promise that resolves to the selected item or `undefined` when being dismissed.
         */
        export function showInformationMessage<T extends MessageItem>(message: string, ...items: T[]): PromiseLike<T | undefined>;

        /**
         * Show an information message.
         *
         * @param message a message to show.
         * @param options Configures the behaviour of the message.
         * @param items A set of items that will be rendered as actions in the message.
         * @return A promise that resolves to the selected item or `undefined` when being dismissed.
         */
        export function showInformationMessage<T extends MessageItem>(message: string, options: MessageOptions, ...items: T[]): PromiseLike<T | undefined>;

        /**
         * Show a warning message.
         *
         * @param message a message to show.
         * @param items A set of items that will be rendered as actions in the message.
         * @return A promise that resolves to the selected item or `undefined` when being dismissed.
         */
        export function showWarningMessage(message: string, ...items: string[]): PromiseLike<string | undefined>;

        /**
         * Show a warning message.
         *
         * @param message a message to show.
         * @param options Configures the behaviour of the message.
         * @param items A set of items that will be rendered as actions in the message.
         * @return A promise that resolves to the selected item or `undefined` when being dismissed.
         */
        export function showWarningMessage(message: string, options: MessageOptions, ...items: string[]): PromiseLike<string | undefined>;

        /**
         * Show a warning message.
         *
         * @param message a message to show.
         * @param items A set of items that will be rendered as actions in the message.
         * @return A promise that resolves to the selected item or `undefined` when being dismissed.
         */
        export function showWarningMessage<T extends MessageItem>(message: string, ...items: T[]): PromiseLike<T | undefined>;

        /**
         * Show a warning message.
         *
         * @param message a message to show.
         * @param options Configures the behaviour of the message.
         * @param items A set of items that will be rendered as actions in the message.
         * @return A promise that resolves to the selected item or `undefined` when being dismissed.
         */
        export function showWarningMessage<T extends MessageItem>(message: string, options: MessageOptions, ...items: T[]): PromiseLike<T | undefined>;

        /**
         * Show an error message.
         *
         * @param message a message to show.
         * @param items A set of items that will be rendered as actions in the message.
         * @return A promise that resolves to the selected item or `undefined` when being dismissed.
         */
        export function showErrorMessage(message: string, ...items: string[]): PromiseLike<string | undefined>;

        /**
         * Show an error message.
         *
         * @param message a message to show.
         * @param options Configures the behaviour of the message.
         * @param items A set of items that will be rendered as actions in the message.
         * @return A promise that resolves to the selected item or `undefined` when being dismissed.
         */
        export function showErrorMessage(message: string, options: MessageOptions, ...items: string[]): PromiseLike<string | undefined>;

        /**
         * Show an error message.
         *
         * @param message a message to show.
         * @param items A set of items that will be rendered as actions in the message.
         * @return A promise that resolves to the selected item or `undefined` when being dismissed.
         */
        export function showErrorMessage<T extends MessageItem>(message: string, ...items: T[]): PromiseLike<T | undefined>;

        /**
         * Show an error message.
         *
         * @param message a message to show.
         * @param options Configures the behaviour of the message.
         * @param items A set of items that will be rendered as actions in the message.
         * @return A promise that resolves to the selected item or `undefined` when being dismissed.
         */
        export function showErrorMessage<T extends MessageItem>(message: string, options: MessageOptions, ...items: T[]): PromiseLike<T | undefined>;

        /**
         * Opens an input box to ask the user for input.
         *
         * The returned value will be `undefined` if the input box was canceled (e.g. pressing ESC). Otherwise the
         * returned value will be the string typed by the user or an empty string if the user did not type
         * anything but dismissed the input box with OK.
         *
         * @param options Configures the behavior of the input box.
         * @param token A token that can be used to signal cancellation.
         * @return A promise that resolves to a string the user provided or to `undefined` in case of dismissal.
         */
        export function showInputBox(options?: InputBoxOptions, token?: CancellationToken): PromiseLike<string | undefined>;

        /**
         * Shows a file open dialog to the user which allows to select a file
         * for opening-purposes.
         *
         * @param options Options that control the dialog.
         * @returns A promise that resolves to the selected resources or `undefined`.
         */
        export function showOpenDialog(options: OpenDialogOptions): PromiseLike<Uri[] | undefined>;

        /**
         * Shows a file save dialog to the user which allows to select a file
         * for saving-purposes.
         *
         * @param options Options that control the dialog.
         * @returns A promise that resolves to the selected resource or `undefined`.
         */
        export function showSaveDialog(options: SaveDialogOptions): PromiseLike<Uri | undefined>;

        /**
         * Create and show a new webview panel.
         *
         * @param viewType Identifies the type of the webview panel.
         * @param title Title of the panel.
         * @param showOptions where webview panel will be reside. If preserveFocus is set, the new webview will not take focus.
         * @param options Settings for the new panel.
         *
         * @return New webview panel.
         */
        export function createWebviewPanel(viewType: string, title: string, showOptions: ViewColumn | WebviewPanelShowOptions, options?: WebviewPanelOptions & WebviewOptions): WebviewPanel;

        /**
         * Registers a webview panel serializer.
         *
         * Plugins that support reviving should have an `"onWebviewPanel:viewType"` activation event and
         * make sure that [registerWebviewPanelSerializer](#registerWebviewPanelSerializer) is called during activation.
         *
         * Only a single serializer may be registered at a time for a given `viewType`.
         *
         * @param viewType Type of the webview panel that can be serialized.
         * @param serializer Webview serializer.
         */
        export function registerWebviewPanelSerializer(viewType: string, serializer: WebviewPanelSerializer): Disposable;

        /**
         * Represents the current window's state.
         *
         * @readonly
         */
        export let state: WindowState;

        /**
         * An event which fires when the focus state of the current window changes.
         * The value of the event represents whether the window is focused.
         */
        export const onDidChangeWindowState: Event<WindowState>;

        /**
         * Create a TextEditorDecorationType that can be used to add decorations to text editors.
         *
         * @param options Rendering options for the decoration type.
         * @return A new decoration type instance.
         */
        export function createTextEditorDecorationType(options: DecorationRenderOptions): TextEditorDecorationType;

        /**
         * Set a message to the status bar.
         *
         * @param text The message to show, supports icon substitution as in status bar.
         * @return A disposable which hides the status bar message.
         */
        export function setStatusBarMessage(text: string): Disposable;

        /**
         * Set a message to the status bar.
         *
         * @param text The message to show, supports icon substitution as in status bar.
         * @param hideAfterTimeout Timeout in milliseconds after which the message will be disposed.
         * @return A disposable which hides the status bar message.
         */
        export function setStatusBarMessage(text: string, hideAfterTimeout: number): Disposable;

        /**
         * Set a message to the status bar.
         *
         * @param text The message to show, supports icon substitution as in status bar.
         * @param hideWhenDone PromiseLike on which completion (resolve or reject) the message will be disposed.
         * @return A disposable which hides the status bar message.
         */
        export function setStatusBarMessage(text: string, hideWhenDone: PromiseLike<any>): Disposable;

        /**
         * Creates a status bar [item](#StatusBarItem).
         *
         * @param alignment The alignment of the item.
         * @param priority The priority of the item. Higher values mean the item should be shown more to the left.
         * @return A new status bar item.
         */
        export function createStatusBarItem(alignment?: StatusBarAlignment, priority?: number): StatusBarItem;

        /**
         * Create a new [output channel](#OutputChannel) with the given name.
         *
         * @param name String which will be used to represent the channel in the UI.
         */
        export function createOutputChannel(name: string): OutputChannel;

        /**
         * Create new terminal.
         * @param name - terminal name to display on the UI.
         * @param shellPath - path to the executable shell. For example "/bin/bash", "bash", "sh".
         * @param shellArgs - arguments to configure executable shell. For example ["-l"] - run shell without login.
         */
        export function createTerminal(name?: string, shellPath?: string, shellArgs?: string[]): Terminal;

        /**
         * Event which fires when terminal did closed. Event value contains closed terminal definition.
         */
        export const onDidCloseTerminal: Event<Terminal>;

        /**
         * An [event](#Event) which fires when a terminal has been created,
         * either through the createTerminal API or commands.
         */
        export const onDidOpenTerminal: Event<Terminal>;

        /**
         * Create new terminal with predefined options.
         * @param - terminal options.
         */
        export function createTerminal(options: TerminalOptions): Terminal;

        /**
         * Register a [TreeDataProvider](#TreeDataProvider) for the view contributed using the extension point `views`.
         * This will allow you to contribute data to the [TreeView](#TreeView) and update if the data changes.
         *
         * **Note:** To get access to the [TreeView](#TreeView) and perform operations on it, use [createTreeView](#window.createTreeView).
         *
         * @param viewId Id of the view contributed using the extension point `views`.
         * @param treeDataProvider A [TreeDataProvider](#TreeDataProvider) that provides tree data for the view
         */
        export function registerTreeDataProvider<T>(viewId: string, treeDataProvider: TreeDataProvider<T>): Disposable;

        /**
         * Create a [TreeView](#TreeView) for the view contributed using the extension point `views`.
         * @param viewId Id of the view contributed using the extension point `views`.
         * @param options Options object to provide [TreeDataProvider](#TreeDataProvider) for the view.
         * @returns a [TreeView](#TreeView).
         */
        export function createTreeView<T>(viewId: string, options: TreeViewOptions<T>): TreeView<T>;

        /**
         * Registers a [uri handler](#UriHandler) capable of handling system-wide [uris](#Uri).
         * In case there are multiple windows open, the topmost window will handle the uri.
         * A uri handler is scoped to the extension it is contributed from; it will only
         * be able to handle uris which are directed to the extension itself. A uri must respect
         * the following rules:
         *
         * - The uri-scheme must be the product name;
         * - The uri-authority must be the extension id (eg. `my.extension`);
         * - The uri-path, -query and -fragment parts are arbitrary.
         *
         * For example, if the `my.extension` extension registers a uri handler, it will only
         * be allowed to handle uris with the prefix `product-name://my.extension`.
         *
         * An extension can only register a single uri handler in its entire activation lifetime.
         *
         * * *Note:* There is an activation event `onUri` that fires when a uri directed for
         * the current extension is about to be handled.
         *
         * @param handler The uri handler to register for this extension.
         */
        export function registerUriHandler(handler: UriHandler): Disposable;

        /**
         * Show progress in the editor. Progress is shown while running the given callback
         * and while the promise it returned isn't resolved nor rejected. The location at which
         * progress should show (and other details) is defined via the passed [`ProgressOptions`](#ProgressOptions).
         *
         * @param task A callback returning a promise. Progress state can be reported with
         * the provided [progress](#Progress)-object.
         *
         * To report discrete progress, use `increment` to indicate how much work has been completed. Each call with
         * a `increment` value will be summed up and reflected as overall progress until 100% is reached (a value of
         * e.g. `10` accounts for `10%` of work done).
         * Note that currently only `ProgressLocation.Notification` is capable of showing discrete progress.
         *
         * To monitor if the operation has been cancelled by the user, use the provided [`CancellationToken`](#CancellationToken).
         * Note that currently only `ProgressLocation.Notification` is supporting to show a cancel button to cancel the
         * long running operation.
         *
         * @return The thenable the task-callback returned.
         */
        export function withProgress<R>(options: ProgressOptions, task: (progress: Progress<{ message?: string; increment?: number }>, token: CancellationToken) => PromiseLike<R>): PromiseLike<R>;
    }
    /**
     * Value-object describing where and how progress should show.
     */
    export interface ProgressOptions {
        /**
         * The location at which progress should show.
         */
        location: ProgressLocation;
        /**
         * A human-readable string which will be used to describe the
         * operation.
         */
        title?: string;
        /**
         * Controls if a cancel button should show to allow the user to
         * cancel the long running operation.  Note that currently only
         * `ProgressLocation.Notification` is supporting to show a cancel
         * button.
         */
        cancellable?: boolean;
    }
    /**
     * A location in the editor at which progress information can be shown. It depends on the
     * location how progress is visually represented.
     */
    export enum ProgressLocation {
        /**
         * Show progress for the source control viewlet, as overlay for the icon and as progress bar
         * inside the viewlet (when visible). Neither supports cancellation nor discrete progress.
         */
        SourceControl = 1,
        /**
         * Show progress in the status bar of the editor. Neither supports cancellation nor discrete progress.
         */
        Window = 10,
        /**
         * Show progress as notification with an optional cancel button. Supports to show infinite and discrete progress.
         */
        Notification = 15
    }
    /**
     * Defines a generalized way of reporting progress updates.
     */
    export interface Progress<T> {
        /**
         * Report a progress update.
         * @param value A progress item, like a message and/or an
         * report on how much work finished
         */
        report(value: T): void;
    }

    /**
     * Options for creating a [TreeView](#TreeView)
     */
    export interface TreeViewOptions<T> {

        /**
         * A data provider that provides tree data.
         */
        treeDataProvider: TreeDataProvider<T>;

        /**
         * Whether to show collapse all action or not.
         */
        showCollapseAll?: boolean;
    }

    /**
     * The event that is fired when an element in the [TreeView](#TreeView) is expanded or collapsed
     */
    export interface TreeViewExpansionEvent<T> {

        /**
         * Element that is expanded or collapsed.
         */
        element: T;

    }

    /**
     * Represents a Tree view
     */
    export interface TreeView<T> extends Disposable {

        /**
         * Event that is fired when an element is expanded
         */
        readonly onDidExpandElement: Event<TreeViewExpansionEvent<T>>;

        /**
         * Event that is fired when an element is collapsed
         */
        readonly onDidCollapseElement: Event<TreeViewExpansionEvent<T>>;

        /**
         * Currently selected elements.
         */
        readonly selection: ReadonlyArray<T>;

        /**
         * Reveal an element. By default revealed element is selected.
         *
         * In order to not to select, set the option `select` to `false`.
         *
         * **NOTE:** [TreeDataProvider](#TreeDataProvider) is required to implement [getParent](#TreeDataProvider.getParent) method to access this API.
         */
        reveal(element: T, options?: { select?: boolean, focus?: boolean, expand?: boolean | number }): PromiseLike<void>;
    }

    /**
     * A data provider that provides tree data
     */
    export interface TreeDataProvider<T> {
        /**
         * An optional event to signal that an element or root has changed.
         * This will trigger the view to update the changed element/root and its children recursively (if shown).
         * To signal that root has changed, do not pass any argument or pass `undefined` or `null`.
         */
        onDidChangeTreeData?: Event<T | undefined | null>;

        /**
         * Get [TreeItem](#TreeItem) representation of the `element`
         *
         * @param element The element for which [TreeItem](#TreeItem) representation is asked for.
         * @return [TreeItem](#TreeItem) representation of the element
         */
        getTreeItem(element: T): TreeItem | PromiseLike<TreeItem>;

        /**
         * Get the children of `element` or root if no element is passed.
         *
         * @param element The element from which the provider gets children. Can be `undefined`.
         * @return Children of `element` or root if no element is passed.
         */
        getChildren(element?: T): ProviderResult<T[]>;

        /**
         * Optional method to return the parent of `element`.
         * Return `null` or `undefined` if `element` is a child of root.
         *
         * **NOTE:** This method should be implemented in order to access [reveal](#TreeView.reveal) API.
         *
         * @param element The element for which the parent has to be returned.
         * @return Parent of `element`.
         */
        getParent?(element: T): ProviderResult<T>;
    }

    export class TreeItem {
        /**
         * A human-readable string describing this item. When `falsy`, it is derived from [resourceUri](#TreeItem.resourceUri).
         */
        label?: string;

        /**
         * Optional id for the tree item that has to be unique across tree. The id is used to preserve the selection and expansion state of the tree item.
         *
         * If not provided, an id is generated using the tree item's label. **Note** that when labels change, ids will change and that selection and expansion state cannot be kept stable anymore.
         */
        id?: string;

        /**
         * The icon path or [ThemeIcon](#ThemeIcon) for the tree item.
         * When `falsy`, [Folder Theme Icon](#ThemeIcon.Folder) is assigned, if item is collapsible otherwise [File Theme Icon](#ThemeIcon.File).
         * When a [ThemeIcon](#ThemeIcon) is specified, icon is derived from the current file icon theme for the specified theme icon using [resourceUri](#TreeItem.resourceUri) (if provided).
         */
        iconPath?: string | Uri | { light: string | Uri; dark: string | Uri } | ThemeIcon;

        /**
         * The [uri](#Uri) of the resource representing this item.
         *
         * Will be used to derive the [label](#TreeItem.label), when it is not provided.
         * Will be used to derive the icon from current icon theme, when [iconPath](#TreeItem.iconPath) has [ThemeIcon](#ThemeIcon) value.
         */
        resourceUri?: Uri;

        /**
         * The tooltip text when you hover over this item.
         */
        tooltip?: string | undefined;

        /**
         * The [command](#Command) which should be run when the tree item is selected.
         */
        command?: Command;

        /**
         * [TreeItemCollapsibleState](#TreeItemCollapsibleState) of the tree item.
         */
        collapsibleState?: TreeItemCollapsibleState;

        /**
         * Context value of the tree item. This can be used to contribute item specific actions in the tree.
         * For example, a tree item is given a context value as `folder`. When contributing actions to `view/item/context`
         * using `menus` extension point, you can specify context value for key `viewItem` in `when` expression like `viewItem == folder`.
         * ```
         *    "contributes": {
         *        "menus": {
         *            "view/item/context": [
         *                {
         *                    "command": "extension.deleteFolder",
         *                    "when": "viewItem == folder"
         *                }
         *            ]
         *        }
         *    }
         * ```
         * This will show action `extension.deleteFolder` only for items with `contextValue` is `folder`.
         */
        contextValue?: string;

        /**
         * @param label A human-readable string describing this item
         * @param collapsibleState [TreeItemCollapsibleState](#TreeItemCollapsibleState) of the tree item. Default is [TreeItemCollapsibleState.None](#TreeItemCollapsibleState.None)
         */
        constructor(label: string, collapsibleState?: TreeItemCollapsibleState);

        /**
         * @param resourceUri The [uri](#Uri) of the resource representing this item.
         * @param collapsibleState [TreeItemCollapsibleState](#TreeItemCollapsibleState) of the tree item. Default is [TreeItemCollapsibleState.None](#TreeItemCollapsibleState.None)
         */
        // constructor(resourceUri: Uri, collapsibleState?: TreeItemCollapsibleState);
    }

    /**
     * Collapsible state of the tree item
     */
    export enum TreeItemCollapsibleState {
        /**
         * Determines an item can be neither collapsed nor expanded. Implies it has no children.
         */
        None = 0,
        /**
         * Determines an item is collapsed
         */
        Collapsed = 1,
        /**
         * Determines an item is expanded
         */
        Expanded = 2
    }

    /**
     * Represents the configuration. It is a merged view of
     *
     * - Default configuration
     * - Global configuration
     * - Workspace configuration (if available)
     * - Workspace folder configuration of the requested resource (if available)
     *
     * *Global configuration* comes from User Settings and shadows Defaults.
     *
     * *Workspace configuration* comes from Workspace Settings and shadows Global configuration.
     *
     * *Workspace Folder configuration* comes from `.vscode` folder under one of the [workspace folders](#workspace.workspaceFolders).
     *
     * *Note:* Workspace and Workspace Folder configurations contains `launch` and `tasks` settings. Their basename will be
     * part of the section identifier. The following snippets shows how to retrieve all configurations
     * from `launch.json`:
     *
     * ```ts
     * // launch.json configuration
     * const config = workspace.getConfiguration('launch', vscode.window.activeTextEditor.document.uri);
     *
     * // retrieve values
     * const values = config.get('configurations');
     * ```
     *
     * Refer to [Settings](https://code.visualstudio.com/docs/getstarted/settings) for more information.
     */
    export interface WorkspaceConfiguration {

        /**
         * Return a value from this configuration.
         *
         * @param section Configuration name, supports _dotted_ names.
         * @return The value `section` denotes or `undefined`.
         */
        get<T>(section: string): T | undefined;

        /**
         * Return a value from this configuration.
         *
         * @param section Configuration name, supports _dotted_ names.
         * @param defaultValue A value should be returned when no value could be found, is `undefined`.
         * @return The value `section` denotes or the default.
         */
        get<T>(section: string, defaultValue: T): T;

        /**
         * Check if this configuration has a certain value.
         *
         * @param section Configuration name, supports _dotted_ names.
         * @return `true` if the section doesn't resolve to `undefined`.
         */
        has(section: string): boolean;

        /**
         * Retrieve all information about a configuration setting. A configuration value
         * often consists of a *default* value, a global or installation-wide value,
         * a workspace-specific value and a folder-specific value.
         *
         * The *effective* value (returned by [`get`](#WorkspaceConfiguration.get))
         * is computed like this: `defaultValue` overwritten by `globalValue`,
         * `globalValue` overwritten by `workspaceValue`. `workspaceValue` overwritten by `workspaceFolderValue`.
         * Refer to [Settings Inheritence](https://code.visualstudio.com/docs/getstarted/settings)
         * for more information.
         *
         * *Note:* The configuration name must denote a leaf in the configuration tree
         * (`editor.fontSize` vs `editor`) otherwise no result is returned.
         *
         * @param section Configuration name, supports _dotted_ names.
         * @return Information about a configuration setting or `undefined`.
         */
        inspect<T>(section: string): { key: string; defaultValue?: T; globalValue?: T; workspaceValue?: T, workspaceFolderValue?: T } | undefined;

        /**
         * Update a configuration value. The updated configuration values are persisted.
         *
         * A value can be changed in
         *
         * - [Global configuration](#ConfigurationTarget.Global): Changes the value for all instances of the editor.
         * - [Workspace configuration](#ConfigurationTarget.Workspace): Changes the value for current workspace, if available.
         * - [Workspace folder configuration](#ConfigurationTarget.WorkspaceFolder): Changes the value for the
         * [Workspace folder](#workspace.workspaceFolders) to which the current [configuration](#WorkspaceConfiguration) is scoped to.
         *
         * *Note 1:* Setting a global value in the presence of a more specific workspace value
         * has no observable effect in that workspace, but in others. Setting a workspace value
         * in the presence of a more specific folder value has no observable effect for the resources
         * under respective [folder](#workspace.workspaceFolders), but in others. Refer to
         * [Settings Inheritence](https://code.visualstudio.com/docs/getstarted/settings) for more information.
         *
         * *Note 2:* To remove a configuration value use `undefined`, like so: `config.update('somekey', undefined)`
         *
         * Will throw error when
         * - Writing a configuration which is not registered.
         * - Writing a configuration to workspace or folder target when no workspace is opened
         * - Writing a configuration to folder target when there is no folder settings
         * - Writing to folder target without passing a resource when getting the configuration (`workspace.getConfiguration(section, resource)`)
         * - Writing a window configuration to folder target
         *
         * @param section Configuration name, supports _dotted_ names.
         * @param value The new value.
         * @param configurationTarget The [configuration target](#ConfigurationTarget) or a boolean value.
         * - If `true` configuration target is `ConfigurationTarget.Global`.
         * - If `false` configuration target is `ConfigurationTarget.Workspace`.
         * - If `undefined` or `null` configuration target is
         * `ConfigurationTarget.WorkspaceFolder` when configuration is resource specific
         * `ConfigurationTarget.Workspace` otherwise.
         */
        update(section: string, value: any, configurationTarget?: ConfigurationTarget | boolean): PromiseLike<void>;

        /**
         * Readable dictionary that backs this configuration.
         */
        readonly [key: string]: any;
    }

    /**
     * The configuration target
     */
    export enum ConfigurationTarget {
        /**
         * Global configuration
         */
        Global = 1,
        /**
         * Workspace configuration
         */
        Workspace = 2,
        /**
         * Workspace folder configuration
         */
        WorkspaceFolder = 3
    }

    /**
     * An event describing the change in Configuration
     */
    export interface ConfigurationChangeEvent {

        /**
         * Returns `true` if the given section for the given resource (if provided) is affected.
         *
         * @param section Configuration name, supports _dotted_ names.
         * @param resource A resource Uri.
         * @return `true` if the given section for the given resource (if provided) is affected.
         */
        affectsConfiguration(section: string, resource?: Uri): boolean;
    }

    /**
     * An event describing a change to the set of [workspace folders](#workspace.workspaceFolders).
     */
    export interface WorkspaceFoldersChangeEvent {
        /**
         * Added workspace folders.
         */
        readonly added: WorkspaceFolder[];

        /**
         * Removed workspace folders.
         */
        readonly removed: WorkspaceFolder[];
    }

    /**
     * A workspace folder is one of potentially many roots opened by the editor. All workspace folders
     * are equal which means there is no notion of an active or master workspace folder.
     */
    export interface WorkspaceFolder {
        /**
         * The associated uri for this workspace folder.
         *
         * *Note:* The [Uri](#Uri)-type was intentionally chosen such that future releases of the editor can support
         * workspace folders that are not stored on the local disk, e.g. `ftp://server/workspaces/foo`.
         */
        readonly uri: Uri;

        /**
         * The name of this workspace folder. Defaults to
         * the basename of its [uri-path](#Uri.path)
         */
        readonly name: string;

        /**
         * The ordinal number of this workspace folder.
         */
        readonly index: number;
    }

    /**
     * Enumeration of file types. The types `File` and `Directory` can also be
     * a symbolic links, in that use `FileType.File | FileType.SymbolicLink` and
     * `FileType.Directory | FileType.SymbolicLink`.
     */
    export enum FileType {
        /**
         * The file type is unknown.
         */
        Unknown = 0,
        /**
         * A regular file.
         */
        File = 1,
        /**
         * A directory.
         */
        Directory = 2,
        /**
         * A symbolic link to a file.
         */
        SymbolicLink = 64
    }

    /**
     * The `FileStat`-type represents metadata about a file
     */
    export interface FileStat {
        /**
         * The type of the file, e.g. is a regular file, a directory, or symbolic link
         * to a file.
         */
        type: FileType;
        /**
         * The creation timestamp in milliseconds elapsed since January 1, 1970 00:00:00 UTC.
         */
        ctime: number;
        /**
         * The modification timestamp in milliseconds elapsed since January 1, 1970 00:00:00 UTC.
         */
        mtime: number;
        /**
         * The size in bytes.
         */
        size: number;
    }

    /**
	 * A type that filesystem providers should use to signal errors.
	 *
	 * This class has factory methods for common error-cases, like `EntryNotFound` when
	 * a file or folder doesn't exist, use them like so: `throw vscode.FileSystemError.EntryNotFound(someUri);`
	 */
    export class FileSystemError extends Error {

        /**
         * Create an error to signal that a file or folder wasn't found.
         * @param messageOrUri Message or uri.
         */
        static FileNotFound(messageOrUri?: string | Uri): FileSystemError;

        /**
         * Create an error to signal that a file or folder already exists, e.g. when
         * creating but not overwriting a file.
         * @param messageOrUri Message or uri.
         */
        static FileExists(messageOrUri?: string | Uri): FileSystemError;

        /**
         * Create an error to signal that a file is not a folder.
         * @param messageOrUri Message or uri.
         */
        static FileNotADirectory(messageOrUri?: string | Uri): FileSystemError;

        /**
         * Create an error to signal that a file is a folder.
         * @param messageOrUri Message or uri.
         */
        static FileIsADirectory(messageOrUri?: string | Uri): FileSystemError;

        /**
         * Create an error to signal that an operation lacks required permissions.
         * @param messageOrUri Message or uri.
         */
        static NoPermissions(messageOrUri?: string | Uri): FileSystemError;

        /**
         * Create an error to signal that the file system is unavailable or too busy to
         * complete a request.
         * @param messageOrUri Message or uri.
         */
        static Unavailable(messageOrUri?: string | Uri): FileSystemError;

        /**
         * Creates a new filesystem error.
         *
         * @param messageOrUri Message or uri.
         */
        constructor(messageOrUri?: string | Uri);
    }

    /**
     * Enumeration of file change types.
     */
    export enum FileChangeType {

        /**
         * The contents or metadata of a file have changed.
         */
        Changed = 1,

        /**
         * A file has been created.
         */
        Created = 2,

        /**
         * A file has been deleted.
         */
        Deleted = 3,
    }

    /**
     * The event filesystem providers must use to signal a file change.
     */
    export interface FileChangeEvent {

        /**
         * The type of change.
         */
        type: FileChangeType;

        /**
         * The uri of the file that has changed.
         */
        uri: Uri;
    }

    /**
     * The filesystem provider defines what the editor needs to read, write, discover,
     * and to manage files and folders. It allows extensions to serve files from remote places,
     * like ftp-servers, and to seamlessly integrate those into the editor.
     *
     * * *Note 1:* The filesystem provider API works with [uris](#Uri) and assumes hierarchical
     * paths, e.g. `foo:/my/path` is a child of `foo:/my/` and a parent of `foo:/my/path/deeper`.
     * * *Note 2:* There is an activation event `onFileSystem:<scheme>` that fires when a file
     * or folder is being accessed.
     * * *Note 3:* The word 'file' is often used to denote all [kinds](#FileType) of files, e.g.
     * folders, symbolic links, and regular files.
     */
    export interface FileSystemProvider {

        /**
         * An event to signal that a resource has been created, changed, or deleted. This
         * event should fire for resources that are being [watched](#FileSystemProvider.watch)
         * by clients of this provider.
         */
        readonly onDidChangeFile: Event<FileChangeEvent[]>;

        /**
         * Subscribe to events in the file or folder denoted by `uri`.
         *
         * The editor will call this function for files and folders. In the latter case, the
         * options differ from defaults, e.g. what files/folders to exclude from watching
         * and if subfolders, sub-subfolder, etc. should be watched (`recursive`).
         *
         * @param uri The uri of the file to be watched.
         * @param options Configures the watch.
         * @returns A disposable that tells the provider to stop watching the `uri`.
         */
        watch(uri: Uri, options: { recursive: boolean; excludes: string[] }): Disposable;

        /**
         * Retrieve metadata about a file.
         *
         * Note that the metadata for symbolic links should be the metadata of the file they refer to.
         * Still, the [SymbolicLink](#FileType.SymbolicLink)-type must be used in addition to the actual type, e.g.
         * `FileType.SymbolicLink | FileType.Directory`.
         *
         * @param uri The uri of the file to retrieve metadata about.
         * @return The file metadata about the file.
         * @throws [`FileNotFound`](#FileSystemError.FileNotFound) when `uri` doesn't exist.
         */
        stat(uri: Uri): FileStat | PromiseLike<FileStat>;

        /**
         * Retrieve all entries of a [directory](#FileType.Directory).
         *
         * @param uri The uri of the folder.
         * @return An array of name/type-tuples or a thenable that resolves to such.
         * @throws [`FileNotFound`](#FileSystemError.FileNotFound) when `uri` doesn't exist.
         */
        readDirectory(uri: Uri): [string, FileType][] | PromiseLike<[string, FileType][]>;

        /**
         * Create a new directory (Note, that new files are created via `write`-calls).
         *
         * @param uri The uri of the new folder.
         * @throws [`FileNotFound`](#FileSystemError.FileNotFound) when the parent of `uri` doesn't exist, e.g. no mkdirp-logic required.
         * @throws [`FileExists`](#FileSystemError.FileExists) when `uri` already exists.
         * @throws [`NoPermissions`](#FileSystemError.NoPermissions) when permissions aren't sufficient.
         */
        createDirectory(uri: Uri): void | PromiseLike<void>;

        /**
         * Read the entire contents of a file.
         *
         * @param uri The uri of the file.
         * @return An array of bytes or a thenable that resolves to such.
         * @throws [`FileNotFound`](#FileSystemError.FileNotFound) when `uri` doesn't exist.
         */
        readFile(uri: Uri): Uint8Array | PromiseLike<Uint8Array>;

        /**
         * Write data to a file, replacing its entire contents.
         *
         * @param uri The uri of the file.
         * @param content The new content of the file.
         * @param options Defines if missing files should or must be created.
         * @throws [`FileNotFound`](#FileSystemError.FileNotFound) when `uri` doesn't exist and `create` is not set.
         * @throws [`FileNotFound`](#FileSystemError.FileNotFound) when the parent of `uri` doesn't exist and `create` is set, e.g. no mkdirp-logic required.
         * @throws [`FileExists`](#FileSystemError.FileExists) when `uri` already exists, `create` is set but `overwrite` is not set.
         * @throws [`NoPermissions`](#FileSystemError.NoPermissions) when permissions aren't sufficient.
         */
        writeFile(uri: Uri, content: Uint8Array, options: { create: boolean, overwrite: boolean }): void | PromiseLike<void>;

        /**
         * Delete a file.
         *
         * @param uri The resource that is to be deleted.
         * @param options Defines if deletion of folders is recursive.
         * @throws [`FileNotFound`](#FileSystemError.FileNotFound) when `uri` doesn't exist.
         * @throws [`NoPermissions`](#FileSystemError.NoPermissions) when permissions aren't sufficient.
         */
        delete(uri: Uri, options: { recursive: boolean }): void | PromiseLike<void>;

        /**
         * Rename a file or folder.
         *
         * @param oldUri The existing file.
         * @param newUri The new location.
         * @param options Defines if existing files should be overwritten.
         * @throws [`FileNotFound`](#FileSystemError.FileNotFound) when `oldUri` doesn't exist.
         * @throws [`FileNotFound`](#FileSystemError.FileNotFound) when parent of `newUri` doesn't exist, e.g. no mkdirp-logic required.
         * @throws [`FileExists`](#FileSystemError.FileExists) when `newUri` exists and when the `overwrite` option is not `true`.
         * @throws [`NoPermissions`](#FileSystemError.NoPermissions) when permissions aren't sufficient.
         */
        rename(oldUri: Uri, newUri: Uri, options: { overwrite: boolean }): void | PromiseLike<void>;

        /**
         * Copy files or folders. Implementing this function is optional but it will speedup
         * the copy operation.
         *
         * @param source The existing file.
         * @param destination The destination location.
         * @param options Defines if existing files should be overwriten.
         * @throws [`FileNotFound`](#FileSystemError.FileNotFound) when `source` doesn't exist.
         * @throws [`FileNotFound`](#FileSystemError.FileNotFound) when parent of `destination` doesn't exist, e.g. no mkdirp-logic required.
         * @throws [`FileExists`](#FileSystemError.FileExists) when `destination` exists and when the `overwrite` option is not `true`.
         * @throws [`NoPermissions`](#FileSystemError.NoPermissions) when permissions aren't sufficient.
         */
        copy?(source: Uri, destination: Uri, options: { overwrite: boolean }): void | PromiseLike<void>;
    }

    /**
     * Namespace for dealing with the current workspace. A workspace is the representation
     * of the folder that has been opened. There is no workspace when just a file but not a
     * folder has been opened.
     *
     * The workspace offers support for [listening](#workspace.createFileSystemWatcher) to fs
     * events and for [finding](#workspace.findFiles) files. Both perform well and run _outside_
     * the editor-process so that they should be always used instead of nodejs-equivalents.
     */
    export namespace workspace {

        /**
         * ~~The folder that is open in the editor. `undefined` when no folder
         * has been opened.~~
         *
         * @deprecated Use [`workspaceFolders`](#workspace.workspaceFolders) instead.
         *
         * @readonly
         */
        export let rootPath: string | undefined;

        /**
         * List of workspace folders or `undefined` when no folder is open.
         * *Note* that the first entry corresponds to the value of `rootPath`.
         *
         * @readonly
         */
        export let workspaceFolders: WorkspaceFolder[] | undefined;

        /**
         * The name of the workspace. `undefined` when no folder
         * has been opened.
         *
         * @readonly
         */
        export let name: string | undefined;

        /**
         * An event that is emitted when a workspace folder is added or removed.
         */
        export const onDidChangeWorkspaceFolders: Event<WorkspaceFoldersChangeEvent>;

        /**
         * All text documents currently known to the system.
         *
         * @readonly
         */
        export let textDocuments: TextDocument[];

        /**
         * Register a text document content provider.
         *
         * Only one provider can be registered per scheme.
         *
         * @param scheme The uri-scheme to register for.
         * @param provider A content provider.
         * @return A [disposable](#Disposable) that unregisters this provider when being disposed.
         */
        export function registerTextDocumentContentProvider(scheme: string, provider: TextDocumentContentProvider): Disposable;

        /**
         * An event that is emitted when a [text document](#TextDocument) is opened.
         *
         * To add an event listener when a visible text document is opened, use the [TextEditor](#TextEditor) events in the
         * [window](#window) namespace. Note that:
         *
         * - The event is emitted before the [document](#TextDocument) is updated in the
         * [active text editor](#window.activeTextEditor)
         * - When a [text document](#TextDocument) is already open (e.g.: open in another [visible text editor](#window.visibleTextEditors)) this event is not emitted
         *
         */
        export const onDidOpenTextDocument: Event<TextDocument>;

        /**
         * An event that is emitted when a [text document](#TextDocument) is disposed.
         *
         * To add an event listener when a visible text document is closed, use the [TextEditor](#TextEditor) events in the
         * [window](#window) namespace. Note that this event is not emitted when a [TextEditor](#TextEditor) is closed
         * but the document remains open in another [visible text editor](#window.visibleTextEditors).
         */
        export const onDidCloseTextDocument: Event<TextDocument>;

        /**
         * An event that is emitted when a [text document](#TextDocument) is changed. This usually happens
         * when the [contents](#TextDocument.getText) changes but also when other things like the
         * [dirty](#TextDocument.isDirty)-state changes.
         */
        export const onDidChangeTextDocument: Event<TextDocumentChangeEvent>;

        /**
         * An event that is emitted when a [text document](#TextDocument) will be saved to disk.
         *
         * *Note 1:* Subscribers can delay saving by registering asynchronous work. For the sake of data integrity the editor
         * might save without firing this event. For instance when shutting down with dirty files.
         *
         * *Note 2:* Subscribers are called sequentially and they can [delay](#TextDocumentWillSaveEvent.waitUntil) saving
         * by registering asynchronous work. Protection against misbehaving listeners is implemented as such:
         *  * there is an overall time budget that all listeners share and if that is exhausted no further listener is called
         *  * listeners that take a long time or produce errors frequently will not be called anymore
         *
         * The current thresholds are 1.5 seconds as overall time budget and a listener can misbehave 3 times before being ignored.
         */
        export const onWillSaveTextDocument: Event<TextDocumentWillSaveEvent>;

        /**
         * An event that is emitted when a [text document](#TextDocument) is saved to disk.
         */
        export const onDidSaveTextDocument: Event<TextDocument>;

        /**
         * Opens a document. Will return early if this document is already open. Otherwise
         * the document is loaded and the [didOpen](#workspace.onDidOpenTextDocument)-event fires.
         *
         * The document is denoted by an [uri](#Uri). Depending on the [scheme](#Uri.scheme) the
         * following rules apply:
         * * `file`-scheme: Open a file on disk, will be rejected if the file does not exist or cannot be loaded.
         * * `untitled`-scheme: A new file that should be saved on disk, e.g. `untitled:c:\frodo\new.js`. The language
         * will be derived from the file name.
         * * For all other schemes the registered text document content [providers](#TextDocumentContentProvider) are consulted.
         *
         * *Note* that the lifecycle of the returned document is owned by the editor and not by the extension. That means an
         * [`onDidClose`](#workspace.onDidCloseTextDocument)-event can occur at any time after opening it.
         *
         * @param uri Identifies the resource to open.
         * @return A promise that resolves to a [document](#TextDocument).
         */
        export function openTextDocument(uri: Uri): PromiseLike<TextDocument | undefined>;

        /**
         * A short-hand for `openTextDocument(Uri.file(fileName))`.
         *
         * @see [openTextDocument](#openTextDocument)
         * @param fileName A name of a file on disk.
         * @return A promise that resolves to a [document](#TextDocument).
         */
        export function openTextDocument(fileName: string): PromiseLike<TextDocument | undefined>;

        /**
         * Opens an untitled text document. The editor will prompt the user for a file
         * path when the document is to be saved. The `options` parameter allows to
         * specify the *language* and/or the *content* of the document.
         *
         * @param options Options to control how the document will be created.
         * @return A promise that resolves to a [document](#TextDocument).
         */
        export function openTextDocument(options?: { language?: string; content?: string; }): PromiseLike<TextDocument | undefined>;

        /**
         * Get a workspace configuration object.
         *
         * When a section-identifier is provided only that part of the configuration
         * is returned. Dots in the section-identifier are interpreted as child-access,
         * like `{ myExt: { setting: { doIt: true }}}` and `getConfiguration('myExt.setting').get('doIt') === true`.
         *
         * When a resource is provided, configuration scoped to that resource is returned.
         *
         * @param section A dot-separated identifier.
         * @param resource A resource for which the configuration is asked for
         * @return The full configuration or a subset.
         */
        export function getConfiguration(section?: string, resource?: Uri | null): WorkspaceConfiguration;

        /**
         * An event that is emitted when the [configuration](#WorkspaceConfiguration) changed.
         */
        export const onDidChangeConfiguration: Event<ConfigurationChangeEvent>;

        /*
         * Creates a file system watcher.
         *
         * A glob pattern that filters the file events on their absolute path must be provided. Optionally,
         * flags to ignore certain kinds of events can be provided. To stop listening to events the watcher must be disposed.
         *
         * *Note* that only files within the current [workspace folders](#workspace.workspaceFolders) can be watched.
         *
         * @param globPattern A [glob pattern](#GlobPattern) that is applied to the absolute paths of created, changed,
         * and deleted files. Use a [relative pattern](#RelativePattern) to limit events to a certain [workspace folder](#WorkspaceFolder).
         * @param ignoreCreateEvents Ignore when files have been created.
         * @param ignoreChangeEvents Ignore when files have been changed.
         * @param ignoreDeleteEvents Ignore when files have been deleted.
         * @return A new file system watcher instance.
         */
        export function createFileSystemWatcher(
            globPattern: GlobPattern,
            ignoreCreateEvents?: boolean,
            ignoreChangeEvents?: boolean,
            ignoreDeleteEvents?: boolean
        ): FileSystemWatcher;

        /**
         * Find files across all [workspace folders](#workspace.workspaceFolders) in the workspace.
         *
         * @sample `findFiles('**​/*.js', '**​/node_modules/**', 10)`
         * @param include A [glob pattern](#GlobPattern) that defines the files to search for. The glob pattern
         * will be matched against the file paths of resulting matches relative to their workspace. Use a [relative pattern](#RelativePattern)
         * to restrict the search results to a [workspace folder](#WorkspaceFolder).
         * @param exclude  A [glob pattern](#GlobPattern) that defines files and folders to exclude. The glob pattern
         * will be matched against the file paths of resulting matches relative to their workspace. When `undefined` only default excludes will
         * apply, when `null` no excludes will apply.
         * @param maxResults An upper-bound for the result.
         * @param token A token that can be used to signal cancellation to the underlying search engine.
         * @return A thenable that resolves to an array of resource identifiers. Will return no results if no
         * [workspace folders](#workspace.workspaceFolders) are opened.
         */
        export function findFiles(include: GlobPattern, exclude?: GlobPattern | null, maxResults?: number, token?: CancellationToken): PromiseLike<Uri[]>;

        /**
         * Save all dirty files.
         *
         * @param includeUntitled Also save files that have been created during this session.
         * @return A thenable that resolves when the files have been saved.
         */
        export function saveAll(includeUntitled?: boolean): PromiseLike<boolean>;

        /**
         * Make changes to one or many resources or create, delete, and rename resources as defined by the given
         * [workspace edit](#WorkspaceEdit).
         *
         * All changes of a workspace edit are applied in the same order in which they have been added. If
         * multiple textual inserts are made at the same position, these strings appear in the resulting text
         * in the order the 'inserts' were made. Invalid sequences like 'delete file a' -> 'insert text in file a'
         * cause failure of the operation.
         *
         * When applying a workspace edit that consists only of text edits an 'all-or-nothing'-strategy is used.
         * A workspace edit with resource creations or deletions aborts the operation, e.g. consective edits will
         * not be attempted, when a single edit fails.
         *
         * @param edit A workspace edit.
         * @return A thenable that resolves when the edit could be applied.
         */
        export function applyEdit(edit: WorkspaceEdit): PromiseLike<boolean>;

        /**
         * Register a filesystem provider for a given scheme, e.g. `ftp`.
         *
         * There can only be one provider per scheme and an error is being thrown when a scheme
         * has been claimed by another provider or when it is reserved.
         *
         * @param scheme The uri-[scheme](#Uri.scheme) the provider registers for.
         * @param provider The filesystem provider.
         * @param options Immutable metadata about the provider.
         * @return A [disposable](#Disposable) that unregisters this provider when being disposed.
         */
        export function registerFileSystemProvider(scheme: string, provider: FileSystemProvider, options?: { isCaseSensitive?: boolean, isReadonly?: boolean }): Disposable;

        /**
         * Returns the [workspace folder](#WorkspaceFolder) that contains a given uri.
         * * returns `undefined` when the given uri doesn't match any workspace folder
         *
         * @param uri An uri.
         * @return A workspace folder or `undefined`
         */
        export function getWorkspaceFolder(uri: Uri): WorkspaceFolder | undefined;

        /**
         * Returns a path that is relative to the workspace folder or folders.
         *
         * When there are no [workspace folders](#workspace.workspaceFolders) or when the path
         * is not contained in them, the input is returned.
         *
         * @param pathOrUri A path or uri. When a uri is given its [fsPath](#Uri.fsPath) is used.
         * @param includeWorkspaceFolder When `true` and when the given path is contained inside a
         * workspace folder the name of the workspace is prepended. Defaults to `true` when there are
         * multiple workspace folders and `false` otherwise.
         * @return A path relative to the root or the input.
         */
        export function asRelativePath(pathOrUri: string | Uri, includeWorkspaceFolder?: boolean): string | undefined;

        /**
         * This method replaces `deleteCount` [workspace folders](#workspace.workspaceFolders) starting at index `start`
         * by an optional set of `workspaceFoldersToAdd` on the `theia.workspace.workspaceFolders` array. This "splice"
         * behavior can be used to add, remove and change workspace folders in a single operation.
         *
         * If the first workspace folder is added, removed or changed, the currently executing extensions (including the
         * one that called this method) will be terminated and restarted so that the (deprecated) `rootPath` property is
         * updated to point to the first workspace folder.
         *
         * Use the [`onDidChangeWorkspaceFolders()`](#onDidChangeWorkspaceFolders) event to get notified when the
         * workspace folders have been updated.
         *
         * **Example:** adding a new workspace folder at the end of workspace folders
         * ```typescript
         * workspace.updateWorkspaceFolders(workspace.workspaceFolders ? workspace.workspaceFolders.length : 0, null, { uri: ...});
         * ```
         *
         * **Example:** removing the first workspace folder
         * ```typescript
         * workspace.updateWorkspaceFolders(0, 1);
         * ```
         *
         * **Example:** replacing an existing workspace folder with a new one
         * ```typescript
         * workspace.updateWorkspaceFolders(0, 1, { uri: ...});
         * ```
         *
         * It is valid to remove an existing workspace folder and add it again with a different name
         * to rename that folder.
         *
         * **Note:** it is not valid to call [updateWorkspaceFolders()](#updateWorkspaceFolders) multiple times
         * without waiting for the [`onDidChangeWorkspaceFolders()`](#onDidChangeWorkspaceFolders) to fire.
         *
         * @param start the zero-based location in the list of currently opened [workspace folders](#WorkspaceFolder)
         * from which to start deleting workspace folders.
         * @param deleteCount the optional number of workspace folders to remove.
         * @param workspaceFoldersToAdd the optional variable set of workspace folders to add in place of the deleted ones.
         * Each workspace is identified with a mandatory URI and an optional name.
         * @return true if the operation was successfully started and false otherwise if arguments were used that would result
         * in invalid workspace folder state (e.g. 2 folders with the same URI).
         */
        export function updateWorkspaceFolders(start: number, deleteCount: number | undefined | null, ...workspaceFoldersToAdd: { uri: Uri, name?: string }[]): boolean;

        /**
        * ~~Register a task provider.~~
        *
        * @deprecated Use the corresponding function on the `tasks` namespace instead
        *
        * @param type The task kind type this provider is registered for.
        * @param provider A task provider.
        * @return A [disposable](#Disposable) that unregisters this provider when being disposed.
        */
        export function registerTaskProvider(type: string, provider: TaskProvider): Disposable;
    }

    export namespace env {
        /**
         * Gets environment variable value by name.
         *
         * @param envVarName name of environment variable to get
         * @returns value of the given environment variable name or undefined if there is no such variable.
         */
        export function getEnvVariable(envVarName: string): PromiseLike<string | undefined>;

        /**
         * Gets query parameter value by name.
         *
         * @param queryParamName name of query parameter to get.
         * @returns value of the given query parameter or undefined if there is no such variable.
         */
        export function getQueryParameter(queryParamName: string): string | string[] | undefined;

        /**
         * Returns all query parameters of current IDE.
         */
        export function getQueryParameters(): { [key: string]: string | string[] } | undefined;

        /**
         * The application name of the editor, like 'Eclipse Theia'.
         */
        export const appName: string;

        /**
         * The application root folder from which the editor is running.
         */
        export const appRoot: string;

        /**
         * The custom uri scheme the editor registers to in the operating system.
         */
        export const uriScheme: string;

        /**
         * Represents the preferred user-language, like `de-CH`, `fr`, or `en-US`.
         */
        export const language: string;

        /**
         * A unique identifier for the computer.
         */
        export const machineId: string;

        /**
         * A unique identifier for the current session.
         * Changes each time the editor is started.
         */
        export const sessionId: string;

    }

    /**
     * A relative pattern is a helper to construct glob patterns that are matched
     * relatively to a base path. The base path can either be an absolute file path
     * or a [workspace folder](#WorkspaceFolder).
     */
    export class RelativePattern {

        /**
         * A base file path to which this pattern will be matched against relatively.
         */
        base: string;

        /**
         * A file glob pattern like `*.{ts,js}` that will be matched on file paths
         * relative to the base path.
         *
         * Example: Given a base of `/home/work/folder` and a file path of `/home/work/folder/index.js`,
         * the file glob pattern will match on `index.js`.
         */
        pattern: string;

        /**
         * Creates a new relative pattern object with a base path and pattern to match. This pattern
         * will be matched on file paths relative to the base path.
         *
         * @param base A base file path to which this pattern will be matched against relatively.
         * @param pattern A file glob pattern like `*.{ts,js}` that will be matched on file paths
         * relative to the base path.
         */
        constructor(base: WorkspaceFolder | string, pattern: string)
    }

    /**
     * A file glob pattern to match file paths against. This can either be a glob pattern string
     * (like `**​/*.{ts,js}` or `*.{ts,js}`) or a [relative pattern](#RelativePattern).
     *
     * Glob patterns can have the following syntax:
     * * `*` to match one or more characters in a path segment
     * * `?` to match on one character in a path segment
     * * `**` to match any number of path segments, including none
     * * `{}` to group conditions (e.g. `**​/*.{ts,js}` matches all TypeScript and JavaScript files)
     * * `[]` to declare a range of characters to match in a path segment (e.g., `example.[0-9]` to match on `example.0`, `example.1`, …)
     * * `[!...]` to negate a range of characters to match in a path segment (e.g., `example.[!0-9]` to match on `example.a`, `example.b`, but not `example.0`)
     */
    export type GlobPattern = string | RelativePattern;

    /**
     * A document filter denotes a document by different properties like
     * the [language](#TextDocument.languageId), the [scheme](#Uri.scheme) of
     * its resource, or a glob-pattern that is applied to the [path](#TextDocument.fileName).
     *
     * @sample A language filter that applies to typescript files on disk: `{ language: 'typescript', scheme: 'file' }`
     * @sample A language filter that applies to all package.json paths: `{ language: 'json', scheme: 'untitled', pattern: '**​/package.json' }`
     */
    export interface DocumentFilter {

        /**
         * A language id, like `typescript`.
         */
        language?: string;

        /**
         * A Uri [scheme](#Uri.scheme), like `file` or `untitled`.
         */
        scheme?: string;

        /**
         * A [glob pattern](#GlobPattern) that is matched on the absolute path of the document. Use a [relative pattern](#RelativePattern)
         * to filter documents to a [workspace folder](#WorkspaceFolder).
         */
        pattern?: GlobPattern;
    }

    /**
     * A language selector is the combination of one or many language identifiers
     * and [language filters](#DocumentFilter).
     *
     * *Note* that a document selector that is just a language identifier selects *all*
     * documents, even those that are not saved on disk. Only use such selectors when
     * a feature works without further context, e.g without the need to resolve related
     * 'files'.
     *
     * @sample `let sel:DocumentSelector = { scheme: 'file', language: 'typescript' }`;
     */
    export type DocumentSelector = DocumentFilter | string | Array<DocumentFilter | string>;

    /**
     * A tuple of two characters, like a pair of
     * opening and closing brackets.
     */
    export type CharacterPair = [string, string];

    /**
     * Describes how comments for a language work.
     */
    export interface CommentRule {

        /**
         * The line comment token, like `// this is a comment`
         */
        lineComment?: string;

        /**
         * The block comment character pair, like `/* block comment *&#47;`
         */
        blockComment?: CharacterPair;
    }

    /**
     * Describes what to do with the indentation when pressing Enter.
     */
    export enum IndentAction {
        /**
         * Insert new line and copy the previous line's indentation.
         */
        None = 0,
        /**
         * Insert new line and indent once (relative to the previous line's indentation).
         */
        Indent = 1,
        /**
         * Insert two new lines:
         *  - the first one indented which will hold the cursor
         *  - the second one at the same indentation level
         */
        IndentOutdent = 2,
        /**
         * Insert new line and outdent once (relative to the previous line's indentation).
         */
        Outdent = 3
    }

    /**
     * Describes what to do when pressing Enter.
     */
    export interface EnterAction {
        /**
         * Describe what to do with the indentation.
         */
        indentAction: IndentAction;
        /**
         * Describes text to be appended after the new line and after the indentation.
         */
        appendText?: string;
        /**
         * Describes the number of characters to remove from the new line's indentation.
         */
        removeText?: number;
    }

    /**
     * Describes a rule to be evaluated when pressing Enter.
     */
    export interface OnEnterRule {
        /**
         * This rule will only execute if the text before the cursor matches this regular expression.
         */
        beforeText: RegExp;
        /**
         * This rule will only execute if the text after the cursor matches this regular expression.
         */
        afterText?: RegExp;
        /**
         * The action to execute.
         */
        action: EnterAction;
    }

    /**
     * Describes indentation rules for a language.
     */
    export interface IndentationRule {
        /**
         * If a line matches this pattern, then all the lines after it should be unindented once (until another rule matches).
         */
        decreaseIndentPattern: RegExp;
        /**
         * If a line matches this pattern, then all the lines after it should be indented once (until another rule matches).
         */
        increaseIndentPattern: RegExp;
        /**
         * If a line matches this pattern, then **only the next line** after it should be indented once.
         */
        indentNextLinePattern?: RegExp;
        /**
         * If a line matches this pattern, then its indentation should not be changed and it should not be evaluated against the other rules.
         */
        unIndentedLinePattern?: RegExp;
    }

    /**
     * The language configuration interfaces defines the contract between extensions
     * and various editor features, like automatic bracket insertion, automatic indentation etc.
     */
    export interface LanguageConfiguration {
        /**
         * The language's comment settings.
         */
        comments?: CommentRule;
        /**
         * The language's brackets.
         * This configuration implicitly affects pressing Enter around these brackets.
         */
        brackets?: CharacterPair[];
        /**
         * The language's word definition.
         * If the language supports Unicode identifiers (e.g. JavaScript), it is preferable
         * to provide a word definition that uses exclusion of known separators.
         * e.g.: A regex that matches anything except known separators (and dot is allowed to occur in a floating point number):
         *   /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g
         */
        wordPattern?: RegExp;
        /**
         * The language's indentation settings.
         */
        indentationRules?: IndentationRule;
        /**
         * The language's rules to be evaluated when pressing Enter.
         */
        onEnterRules?: OnEnterRule[];

    }

    /**
     * Represents a parameter of a callable-signature. A parameter can
     * have a label and a doc-comment.
     */
    export class ParameterInformation {

        /**
         * The label of this signature. Will be shown in
         * the UI.
         */
        label: string;

        /**
         * The human-readable doc-comment of this signature. Will be shown
         * in the UI but can be omitted.
         */
        documentation?: string | MarkdownString;

        /**
         * Creates a new parameter information object.
         *
         * @param label A label string or inclusive start and exclusive end offsets within its containing signature label.
         * @param documentation A doc string.
         */
        constructor(label: string | [number, number], documentation?: string | MarkdownString);

    }

    /**
     * Represents the signature of something callable. A signature
     * can have a label, like a function-name, a doc-comment, and
     * a set of parameters.
     */
    export class SignatureInformation {

        /**
         * The label of this signature. Will be shown in
         * the UI.
         */
        label: string;

        /**
         * The human-readable doc-comment of this signature. Will be shown
         * in the UI but can be omitted.
         */
        documentation?: string | MarkdownString;

        /**
         * The parameters of this signature.
         */
        parameters: ParameterInformation[];

        /**
         * Creates a new signature information object.
         *
         * @param label A label string.
         * @param documentation A doc string.
         */
        constructor(label: string, documentation?: string | MarkdownString);
    }

    /**
     * Signature help represents the signature of something
     * callable. There can be multiple signatures but only one
     * active and only one active parameter.
     */
    export class SignatureHelp {

        /**
         * One or more signatures.
         */
        signatures: SignatureInformation[];

        /**
         * The active signature.
         */
        activeSignature: number;

        /**
         * The active parameter of the active signature.
         */
        activeParameter: number;
    }

    /**
     * The signature help provider interface defines the contract between extensions and
     * the [parameter hints](https://code.visualstudio.com/docs/editor/intellisense)-feature.
     */
    export interface SignatureHelpProvider {

        /**
         * Provide help for the signature at the given position and document.
         *
         * @param document The document in which the command was invoked.
         * @param position The position at which the command was invoked.
         * @param token A cancellation token.
         * @return Signature help or a thenable that resolves to such. The lack of a result can be
         * signaled by returning `undefined` or `null`.
         */
        provideSignatureHelp(document: TextDocument, position: Position, token: CancellationToken | undefined): ProviderResult<SignatureHelp>;
    }

    /**
     * How a [completion provider](#CompletionItemProvider) was triggered
     */
    export enum CompletionTriggerKind {
        /**
         * Completion was triggered normally.
         */
        Invoke = 0,
        /**
         * Completion was triggered by a trigger character.
         */
        TriggerCharacter = 1,
        /**
         * Completion was re-triggered as current completion list is incomplete
         */
        TriggerForIncompleteCompletions = 2
    }

    /**
     * Contains additional information about the context in which
     * [completion provider](#CompletionItemProvider.provideCompletionItems) is triggered.
     */
    export interface CompletionContext {
        /**
         * How the completion was triggered.
         */
        readonly triggerKind: CompletionTriggerKind;

        /**
         * Character that triggered the completion item provider.
         *
         * `undefined` if provider was not triggered by a character.
         *
         * The trigger character is already in the document when the completion provider is triggered.
         */
        readonly triggerCharacter?: string;
    }

    /**
     * A provider result represents the values a provider, like the [`CompletionItemProvider`](#CompletionItemProvider),
     * may return. For once this is the actual result type `T`, like `CompletionItemProvider`, or a thenable that resolves
     * to that type `T`. In addition, `null` and `undefined` can be returned - either directly or from a
     * thenable.
     *
     */
    export type ProviderResult<T> = T | undefined | PromiseLike<T | undefined>;

    /**
     * A symbol kind.
     */
    export enum SymbolKind {
        File = 0,
        Module = 1,
        Namespace = 2,
        Package = 3,
        Class = 4,
        Method = 5,
        Property = 6,
        Field = 7,
        Constructor = 8,
        Enum = 9,
        Interface = 10,
        Function = 11,
        Variable = 12,
        Constant = 13,
        String = 14,
        Number = 15,
        Boolean = 16,
        Array = 17,
        Object = 18,
        Key = 19,
        Null = 20,
        EnumMember = 21,
        Struct = 22,
        Event = 23,
        Operator = 24,
        TypeParameter = 25
    }

    /**
     * Represents information about programming constructs like variables, classes,
     * interfaces etc.
     */
    export class SymbolInformation {

        /**
         * The name of this symbol.
         */
        name: string;

        /**
         * The name of the symbol containing this symbol.
         */
        containerName: string;

        /**
         * The kind of this symbol.
         */
        kind: SymbolKind;

        /**
         * The location of this symbol.
         */
        location: Location;

        /**
         * Creates a new symbol information object.
         *
         * @param name The name of the symbol.
         * @param kind The kind of the symbol.
         * @param containerName The name of the symbol containing the symbol.
         * @param location The location of the symbol.
         */
        constructor(name: string, kind: SymbolKind, containerName: string, location: Location);

        /**
         * ~~Creates a new symbol information object.~~
         *
         * @deprecated Please use the constructor taking a [location](#Location) object.
         *
         * @param name The name of the symbol.
         * @param kind The kind of the symbol.
         * @param range The range of the location of the symbol.
         * @param uri The resource of the location of symbol, defaults to the current document.
         * @param containerName The name of the symbol containing the symbol.
         */
        constructor(name: string, kind: SymbolKind, range: Range, uri?: Uri, containerName?: string);
    }

    /**
     * Represents programming constructs like variables, classes, interfaces etc. that appear in a document. Document
     * symbols can be hierarchical and they have two ranges: one that encloses its definition and one that points to
     * its most interesting range, e.g. the range of an identifier.
     */
    export class DocumentSymbol {

        /**
         * The name of this symbol.
         */
        name: string;

        /**
         * More detail for this symbol, e.g the signature of a function.
         */
        detail: string;

        /**
         * The kind of this symbol.
         */
        kind: SymbolKind;

        /**
         * The range enclosing this symbol not including leading/trailing whitespace but everything else, e.g comments and code.
         */
        range: Range;

        /**
         * The range that should be selected and reveal when this symbol is being picked, e.g the name of a function.
         * Must be contained by the [`range`](#DocumentSymbol.range).
         */
        selectionRange: Range;

        /**
         * Children of this symbol, e.g. properties of a class.
         */
        children: DocumentSymbol[];

        /**
         * Creates a new document symbol.
         *
         * @param name The name of the symbol.
         * @param detail Details for the symbol.
         * @param kind The kind of the symbol.
         * @param range The full range of the symbol.
         * @param selectionRange The range that should be reveal.
         */
        constructor(name: string, detail: string, kind: SymbolKind, range: Range, selectionRange: Range);
    }

    /**
     * The document symbol provider interface defines the contract between extensions and
     * the [go to symbol](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-symbol)-feature.
     */
    export interface DocumentSymbolProvider {

        /**
         * Provide symbol information for the given document.
         *
         * @param document The document in which the command was invoked.
         * @param token A cancellation token.
         * @return An array of document highlights or a thenable that resolves to such. The lack of a result can be
         * signaled by returning `undefined`, `null`, or an empty array.
         */
        provideDocumentSymbols(document: TextDocument, token: CancellationToken): ProviderResult<SymbolInformation[] | DocumentSymbol[]>;
    }

    /**
    * Represents a color in RGBA space.
    */
    export class Color {

        /**
        * The red component of this color in the range [0-1].
        */
        readonly red: number;

        /**
        * The green component of this color in the range [0-1].
        */
        readonly green: number;

        /**
        * The blue component of this color in the range [0-1].
        */
        readonly blue: number;

        /**
        * The alpha component of this color in the range [0-1].
        */
        readonly alpha: number;

        /**
        * Creates a new color instance.
        *
        * @param red The red component.
        * @param green The green component.
        * @param blue The blue component.
        * @param alpha The alpha component.
        */
        constructor(red: number, green: number, blue: number, alpha: number);
    }

    /**
    * Represents a color range from a document.
    */
    export class ColorInformation {

        /**
        * The range in the document where this color appears.
        */
        range: Range;

        /**
        * The actual color value for this color range.
        */
        color: Color;

        /**
        * Creates a new color range.
        *
        * @param range The range the color appears in. Must not be empty.
        * @param color The value of the color.
        */
        constructor(range: Range, color: Color);
    }

    /**
    * A color presentation object describes how a [`color`](#Color) should be represented as text and what
    * edits are required to refer to it from source code.
    *
    * For some languages one color can have multiple presentations, e.g. css can represent the color red with
    * the constant `Red`, the hex-value `#ff0000`, or in rgba and hsla forms. In csharp other representations
    * apply, e.g `System.Drawing.Color.Red`.
    */
    export class ColorPresentation {

        /**
        * The label of this color presentation. It will be shown on the color
        * picker header. By default this is also the text that is inserted when selecting
        * this color presentation.
        */
        label: string;

        /**
        * An [edit](#TextEdit) which is applied to a document when selecting
        * this presentation for the color.  When `falsy` the [label](#ColorPresentation.label)
        * is used.
        */
        textEdit?: TextEdit;

        /**
        * An optional array of additional [text edits](#TextEdit) that are applied when
        * selecting this color presentation. Edits must not overlap with the main [edit](#ColorPresentation.textEdit) nor with themselves.
        */
        additionalTextEdits?: TextEdit[];

        /**
        * Creates a new color presentation.
        *
        * @param label The label of this color presentation.
        */
        constructor(label: string);
    }

    /**
    * The document color provider defines the contract between extensions and feature of
    * picking and modifying colors in the editor.
    */
    export interface DocumentColorProvider {

        /**
        * Provide colors for the given document.
        *
        * @param document The document in which the command was invoked.
        * @param token A cancellation token.
        * @return An array of [color information](#ColorInformation) or a thenable that resolves to such. The lack of a result
        * can be signaled by returning `undefined`, `null`, or an empty array.
        */
        provideDocumentColors(document: TextDocument, token: CancellationToken): ProviderResult<ColorInformation[]>;

        /**
        * Provide [representations](#ColorPresentation) for a color.
        *
        * @param color The color to show and insert.
        * @param context A context object with additional information
        * @param token A cancellation token.
        * @return An array of color presentations or a thenable that resolves to such. The lack of a result
        * can be signaled by returning `undefined`, `null`, or an empty array.
        */
        provideColorPresentations(color: Color, context: { document: TextDocument, range: Range }, token: CancellationToken): ProviderResult<ColorPresentation[]>;
    }

    /**
    * A line based folding range. To be valid, start and end line must a zero or larger and smaller than the number of lines in the document.
    * Invalid ranges will be ignored.
    */
    export class FoldingRange {

        /**
        * The zero-based start line of the range to fold. The folded area starts after the line's last character.
        * To be valid, the end must be zero or larger and smaller than the number of lines in the document.
        */
        start: number;

        /**
        * The zero-based end line of the range to fold. The folded area ends with the line's last character.
        * To be valid, the end must be zero or larger and smaller than the number of lines in the document.
        */
        end: number;

        /**
        * Describes the [Kind](#FoldingRangeKind) of the folding range such as [Comment](#FoldingRangeKind.Comment) or
        * [Region](#FoldingRangeKind.Region). The kind is used to categorize folding ranges and used by commands
        * like 'Fold all comments'. See
        * [FoldingRangeKind](#FoldingRangeKind) for an enumeration of all kinds.
        * If not set, the range is originated from a syntax element.
        */
        kind?: FoldingRangeKind;

        /**
        * Creates a new folding range.
        *
        * @param start The start line of the folded range.
        * @param end The end line of the folded range.
        * @param kind The kind of the folding range.
        */
        constructor(start: number, end: number, kind?: FoldingRangeKind);
    }

    /**
    * An enumeration of specific folding range kinds. The kind is an optional field of a [FoldingRange](#FoldingRange)
    * and is used to distinguish specific folding ranges such as ranges originated from comments. The kind is used by commands like
    * `Fold all comments` or `Fold all regions`.
    * If the kind is not set on the range, the range originated from a syntax element other than comments, imports or region markers.
    */
    export enum FoldingRangeKind {
        /**
        * Kind for folding range representing a comment.
        */
        Comment = 1,
        /**
        * Kind for folding range representing a import.
        */
        Imports = 2,
        /**
        * Kind for folding range representing regions originating from folding markers like `#region` and `#endregion`.
        */
        Region = 3
    }

    /**
    * Folding context (for future use)
    */
    export interface FoldingContext {
    }

    /**
    * The folding range provider interface defines the contract between extensions and
    * [Folding](https://code.visualstudio.com/docs/editor/codebasics#_folding) in the editor.
    */
    export interface FoldingRangeProvider {
        /**
        * Returns a list of folding ranges or null and undefined if the provider
        * does not want to participate or was cancelled.
        * @param document The document in which the command was invoked.
        * @param context Additional context information (for future use)
        * @param token A cancellation token.
        */
        provideFoldingRanges(document: TextDocument, context: FoldingContext, token: CancellationToken): ProviderResult<FoldingRange[]>;
    }

    /**
     * Value-object that contains additional information when
     * requesting references.
     */
    export interface ReferenceContext {

        /**
         * Include the declaration of the current symbol.
         */
        includeDeclaration: boolean;
    }

    /**
     * The reference provider interface defines the contract between extensions and
     * the [find references](https://code.visualstudio.com/docs/editor/editingevolved#_peek)-feature.
     */
    export interface ReferenceProvider {

        /**
         * Provide a set of project-wide references for the given position and document.
         *
         * @param document The document in which the command was invoked.
         * @param position The position at which the command was invoked.
         * @param context
         * @param token A cancellation token.
         * @return An array of locations or a thenable that resolves to such. The lack of a result can be
         * signaled by returning `undefined`, `null`, or an empty array.
         */
        provideReferences(document: TextDocument, position: Position, context: ReferenceContext, token: CancellationToken): ProviderResult<Location[]>;
    }

    /**
     * A text edit represents edits that should be applied
     * to a document.
     */
    export class TextEdit {

        /**
         * Utility to create a replace edit.
         *
         * @param range A range.
         * @param newText A string.
         * @return A new text edit object.
         */
        static replace(range: Range, newText: string): TextEdit;

        /**
         * Utility to create an insert edit.
         *
         * @param position A position, will become an empty range.
         * @param newText A string.
         * @return A new text edit object.
         */
        static insert(position: Position, newText: string): TextEdit;

        /**
         * Utility to create a delete edit.
         *
         * @param range A range.
         * @return A new text edit object.
         */
        static delete(range: Range): TextEdit;

        /**
         * Utility to create an eol-edit.
         *
         * @param eol An eol-sequence
         * @return A new text edit object.
         */
        static setEndOfLine(eol: EndOfLine): TextEdit;

        /**
         * The range this edit applies to.
         */
        range: Range;

        /**
         * The string this edit will insert.
         */
        newText: string;

        /**
         * The eol-sequence used in the document.
         *
         * *Note* that the eol-sequence will be applied to the
         * whole document.
         */
        newEol: EndOfLine;

        /**
         * Create a new TextEdit.
         *
         * @param range A range.
         * @param newText A string.
         */
        constructor(range: Range, newText: string);
    }

    /**
     * Completion item kinds.
     */
    export enum CompletionItemKind {
        Text = 0,
        Method = 1,
        Function = 2,
        Constructor = 3,
        Field = 4,
        Variable = 5,
        Class = 6,
        Interface = 7,
        Module = 8,
        Property = 9,
        Unit = 10,
        Value = 11,
        Enum = 12,
        Keyword = 13,
        Snippet = 14,
        Color = 15,
        Reference = 17,
        File = 16,
        Folder = 18,
        EnumMember = 19,
        Constant = 20,
        Struct = 21,
        Event = 22,
        Operator = 23,
        TypeParameter = 24
    }

    /**
     * A completion item represents a text snippet that is proposed to complete text that is being typed.
     *
     * It is sufficient to create a completion item from just a [label](#CompletionItem.label). In that
     * case the completion item will replace the [word](#TextDocument.getWordRangeAtPosition)
     * until the cursor with the given label or [insertText](#CompletionItem.insertText). Otherwise the
     * the given [edit](#CompletionItem.textEdit) is used.
     *
     * When selecting a completion item in the editor its defined or synthesized text edit will be applied
     * to *all* cursors/selections whereas [additionalTextEdits](#additionalTextEdits) will be
     * applied as provided.
     *
     * @see [CompletionItemProvider.provideCompletionItems](#CompletionItemProvider.provideCompletionItems)
     * @see [CompletionItemProvider.resolveCompletionItem](#CompletionItemProvider.resolveCompletionItem)
     */
    export class CompletionItem {

        /**
         * The label of this completion item. By default
         * this is also the text that is inserted when selecting
         * this completion.
         */
        label: string;

        /**
         * The kind of this completion item. Based on the kind
         * an icon is chosen by the editor.
         */
        kind?: CompletionItemKind;

        /**
         * A human-readable string with additional information
         * about this item, like type or symbol information.
         */
        detail?: string;

        /**
         * A human-readable string that represents a doc-comment.
         */
        documentation?: string | MarkdownString;

        /**
         * A string that should be used when comparing this item
         * with other items. When `falsy` the [label](#CompletionItem.label)
         * is used.
         */
        sortText?: string;

        /**
         * A string that should be used when filtering a set of
         * completion items. When `falsy` the [label](#CompletionItem.label)
         * is used.
         */
        filterText?: string;

        /**
         * Select this item when showing. *Note* that only one completion item can be selected and
         * that the editor decides which item that is. The rule is that the *first* item of those
         * that match best is selected.
         */
        preselect?: boolean;

        /**
         * A string or snippet that should be inserted in a document when selecting
         * this completion. When `falsy` the [label](#CompletionItem.label)
         * is used.
         */
        insertText?: string | SnippetString;

        /**
         * A range of text that should be replaced by this completion item.
         *
         * Defaults to a range from the start of the [current word](#TextDocument.getWordRangeAtPosition) to the
         * current position.
         *
         * *Note:* The range must be a [single line](#Range.isSingleLine) and it must
         * [contain](#Range.contains) the position at which completion has been [requested](#CompletionItemProvider.provideCompletionItems).
         */
        range?: Range;

        /**
         * An optional set of characters that when pressed while this completion is active will accept it first and
         * then type that character. *Note* that all commit characters should have `length=1` and that superfluous
         * characters will be ignored.
         */
        commitCharacters?: string[];

        /**
         * An optional array of additional [text edits](#TextEdit) that are applied when
         * selecting this completion. Edits must not overlap with the main [edit](#CompletionItem.textEdit)
         * nor with themselves.
         */
        additionalTextEdits?: TextEdit[];

        /**
         * An optional [command](#Command) that is executed *after* inserting this completion. *Note* that
         * additional modifications to the current document should be described with the
         * [additionalTextEdits](#additionalTextEdits)-property.
         */
        command?: Command;

        /**
         * @deprecated Use `CompletionItem.insertText` and `CompletionItem.range` instead.
         *
         * ~~An [edit](#TextEdit) which is applied to a document when selecting
         * this completion. When an edit is provided the value of
         * [insertText](#CompletionItem.insertText) is ignored.~~
         *
         * ~~The [range](#Range) of the edit must be single-line and on the same
         * line completions were [requested](#CompletionItemProvider.provideCompletionItems) at.~~
         */
        textEdit?: TextEdit;

        /**
         * Creates a new completion item.
         *
         * Completion items must have at least a [label](#CompletionItem.label) which then
         * will be used as insert text as well as for sorting and filtering.
         *
         * @param label The label of the completion.
         * @param kind The [kind](#CompletionItemKind) of the completion.
         */
        constructor(label: string, kind?: CompletionItemKind);
    }

    /**
     * Represents a collection of [completion items](#CompletionItem) to be presented
     * in the editor.
     */
    export class CompletionList {

        /**
         * This list is not complete. Further typing should result in recomputing
         * this list.
         */
        isIncomplete?: boolean;

        /**
         * The completion items.
         */
        items: CompletionItem[];

        /**
         * Creates a new completion list.
         *
         * @param items The completion items.
         * @param isIncomplete The list is not complete.
         */
        constructor(items?: CompletionItem[], isIncomplete?: boolean);
    }

    /**
     * The completion item provider interface defines the contract between plugin and IntelliSense
     *
     * Providers can delay the computation of the [`detail`](#CompletionItem.detail)
     * and [`documentation`](#CompletionItem.documentation) properties by implementing the
     * [`resolveCompletionItem`](#CompletionItemProvider.resolveCompletionItem)-function. However, properties that
     * are needed for the initial sorting and filtering, like `sortText`, `filterText`, `insertText`, and `range`, must
     * not be changed during resolve.
     *
     * Providers are asked for completions either explicitly by a user gesture or -depending on the configuration-
     * implicitly when typing words or trigger characters.
     */
    export interface CompletionItemProvider {

        /**
         * Provide completion items for the given position and document.
         *
         * @param document The document in which the command was invoked.
         * @param position The position at which the command was invoked.
         * @param token A cancellation token.
         * @param context How the completion was triggered.
         *
         * @return An array of completions, a [completion list](#CompletionList), or a thenable that resolves to either.
         * The lack of a result can be signaled by returning `undefined`, `null`, or an empty array.
         */
        provideCompletionItems(document: TextDocument,
            position: Position,
            token: CancellationToken | undefined,
            context: CompletionContext
        ): ProviderResult<CompletionItem[] | CompletionList>;

        /**
         * Given a completion item fill in more data, like [doc-comment](#CompletionItem.documentation)
         * or [details](#CompletionItem.detail).
         *
         * The editor will only resolve a completion item once.
         *
         * @param item A completion item currently active in the UI.
         * @param token A cancellation token.
         * @return The resolved completion item or a thenable that resolves to of such. It is OK to return the given
         * `item`. When no result is returned, the given `item` will be used.
         */
        resolveCompletionItem?(item: CompletionItem, token?: CancellationToken): ProviderResult<CompletionItem>;
    }

    /**
     * Represents a location inside a resource, such as a line
     * inside a text file.
     */
    export class Location {

        /**
         * The resource identifier of this location.
         */
        uri: Uri;

        /**
         * The document range of this location.
         */
        range: Range;

        /**
         * Creates a new location object.
         *
         * @param uri The resource identifier.
         * @param rangeOrPosition The range or position. Positions will be converted to an empty range.
         */
        constructor(uri: Uri, rangeOrPosition: Range | Position);
    }

    /**
     * The event that is fired when diagnostics change.
     */
    export interface DiagnosticChangeEvent {

        /**
         * An array of resources for which diagnostics have changed.
         */
        readonly uris: Uri[];
    }

    /**
     * Represents the severity of diagnostics.
     */
    export enum DiagnosticSeverity {

        /**
         * Something not allowed by the rules of a language or other means.
         */
        Error = 0,

        /**
         * Something suspicious but allowed.
         */
        Warning = 1,

        /**
         * Something to inform about but not a problem.
         */
        Information = 2,

        /**
         * Something to hint to a better way of doing it, like proposing
         * a refactoring.
         */
        Hint = 3
    }

    /**
     * Represents a related message and source code location for a diagnostic. This should be
     * used to point to code locations that cause or related to a diagnostics, e.g when duplicating
     * a symbol in a scope.
     */
    export class DiagnosticRelatedInformation {

        /**
         * The location of this related diagnostic information.
         */
        location: Location;

        /**
         * The message of this related diagnostic information.
         */
        message: string;

        /**
         * Creates a new related diagnostic information object.
         *
         * @param location The location.
         * @param message The message.
         */
        constructor(location: Location, message: string);
    }

    /**
     * Additional metadata about the type of a diagnostic.
     */
    export enum DiagnosticTag {
        /**
         * Unused or unnecessary code.
         *
         * Diagnostics with this tag are rendered faded out. The amount of fading
         * is controlled by the `"editorUnnecessaryCode.opacity"` theme color. For
         * example, `"editorUnnecessaryCode.opacity": "#000000c0"` will render the
         * code with 75% opacity. For high contrast themes, use the
         * `"editorUnnecessaryCode.border"` theme color to underline unnecessary code
         * instead of fading it out.
         */
        Unnecessary = 1,
    }

    /**
     * Represents a diagnostic, such as a compiler error or warning. Diagnostic objects
     * are only valid in the scope of a file.
     */
    export class Diagnostic {

        /**
         * The range to which this diagnostic applies.
         */
        range: Range;

        /**
         * The human-readable message.
         */
        message: string;

        /**
         * The severity, default is [error](#DiagnosticSeverity.Error).
         */
        severity: DiagnosticSeverity;

        /**
         * A human-readable string describing the source of this
         * diagnostic, e.g. 'typescript' or 'super lint'.
         */
        source?: string;

        /**
         * A code or identifier for this diagnostics. Will not be surfaced
         * to the user, but should be used for later processing, e.g. when
         * providing [code actions](#CodeActionContext).
         */
        code?: string | number;

        /**
         * An array of related diagnostic information, e.g. when symbol-names within
         * a scope collide all definitions can be marked via this property.
         */
        relatedInformation?: DiagnosticRelatedInformation[];

        /**
         * Additional metadata about the diagnostic.
         */
        tags?: DiagnosticTag[];

        /**
         * Creates a new diagnostic object.
         *
         * @param range The range to which this diagnostic applies.
         * @param message The human-readable message.
         * @param severity The severity, default is [error](#DiagnosticSeverity.Error).
         */
        constructor(range: Range, message: string, severity?: DiagnosticSeverity);
    }

    export interface DiagnosticCollection {

        /**
         * The name of this diagnostic collection, for instance `typescript`. Every diagnostic
         * from this collection will be associated with this name. Also, the task framework uses this
         * name when defining [problem matchers](https://code.visualstudio.com/docs/editor/tasks#_defining-a-problem-matcher).
         */
        readonly name: string;

        /**
         * Assign diagnostics for given resource. Will replace
         * existing diagnostics for that resource.
         *
         * @param uri A resource identifier.
         * @param diagnostics Array of diagnostics or `undefined`
         */
        set(uri: Uri, diagnostics: Diagnostic[] | undefined): void;

        /**
         * Replace all entries in this collection for given uris.
         *
         * Diagnostics of multiple tuples of the same uri will be merged, e.g
         * `[[file1, [d1]], [file1, [d2]]]` is equivalent to `[[file1, [d1, d2]]]`.
         * If a diagnostics item is `undefined` as in `[file1, undefined]`
         * all previous but not subsequent diagnostics are removed.
         *
         * @param entries An array of tuples, like `[[file1, [d1, d2]], [file2, [d3, d4, d5]]]`, or `undefined`.
         */
        set(entries: [Uri, Diagnostic[] | undefined][] | undefined): void;

        /**
         * Remove all diagnostics from this collection that belong
         * to the provided `uri`. The same as `#set(uri, undefined)`.
         *
         * @param uri A resource identifier.
         */
        delete(uri: Uri): void;

        /**
         * Remove all diagnostics from this collection. The same
         * as calling `#set(undefined)`;
         */
        clear(): void;

        /**
         * Iterate over each entry in this collection.
         *
         * @param callback Function to execute for each entry.
         * @param thisArg The `this` context used when invoking the handler function.
         */
        forEach(callback: (uri: Uri, diagnostics: Diagnostic[], collection: DiagnosticCollection) => any, thisArg?: any): void;

        /**
         * Get the diagnostics for a given resource. *Note* that you cannot
         * modify the diagnostics-array returned from this call.
         *
         * @param uri A resource identifier.
         * @returns An immutable array of [diagnostics](#Diagnostic) or `undefined`.
         */
        get(uri: Uri): Diagnostic[] | undefined;

        /**
         * Check if this collection contains diagnostics for a
         * given resource.
         *
         * @param uri A resource identifier.
         * @returns `true` if this collection has diagnostic for the given resource.
         */
        has(uri: Uri): boolean;

        /**
         * Dispose and free associated resources. Calls
         * [clear](#DiagnosticCollection.clear).
         */
        dispose(): void;
    }

    /**
     * A code action represents a change that can be performed in code, e.g. to fix a problem or
     * to refactor code.
     *
     * A CodeAction must set either [`edit`](#edit) and/or a [`command`](#command).
     * If both are supplied, the `edit` is applied first, then the command is executed.
     */
    export class CodeAction {

        /**
         * A short, human-readable, title for this code action.
         */
        title: string;

        /**
         * [Diagnostics](#Diagnostic) that this code action resolves.
         */
        diagnostics?: Diagnostic[];

        /**
         * A [workspace edit](#WorkspaceEdit) this code action performs.
         */
        edit?: WorkspaceEdit;

        /**
         * A [command](#Command) this code action executes.
         */
        command?: Command;

        /**
         * [Kind](#CodeActionKind) of the code action.
         *
         * Used to filter code actions.
         */
        kind?: CodeActionKind;

        /**
         * Creates a new code action.
         *
         * A code action must have at least a [title](#CodeAction.title) and [edits](#CodeAction.edit)
         * and/or a [command](#CodeAction.command).
         *
         * @param title The title of the code action.
         * @param kind The kind of the code action.
         */
        constructor(title: string, kind?: CodeActionKind);
    }

    /**
     * The code action interface defines the contract between extensions and
     * the [light bulb](https://code.visualstudio.com/docs/editor/editingevolved#_code-action) feature.
     *
     * A code action can be any command that is [known](#commands.getCommands) to the system.
     */
    export interface CodeActionProvider {
        /**
         * Provide commands for the given document and range.
         *
         * @param document The document in which the command was invoked.
         * @param range The selector or range for which the command was invoked. This will always be a selection if
         * there is a currently active editor.
         * @param context Context carrying additional information.
         * @param token A cancellation token.
         * @return An array of commands, quick fixes, or refactorings or a thenable of such. The lack of a result can be
         * signaled by returning `undefined`, `null`, or an empty array.
         */
        provideCodeActions(
            document: TextDocument,
            range: Range | Selection,
            context: CodeActionContext,
            token: CancellationToken | undefined
        ): ProviderResult<(Command | CodeAction)[]>;
    }

    /**
     * Metadata about the type of code actions that a [CodeActionProvider](#CodeActionProvider) providers
     */
    export interface CodeActionProviderMetadata {
        /**
         * [CodeActionKinds](#CodeActionKind) that this provider may return.
         *
         * The list of kinds may be generic, such as `CodeActionKind.Refactor`, or the provider
         * may list our every specific kind they provide, such as `CodeActionKind.Refactor.Extract.append('function`)`
         */
        readonly providedCodeActionKinds?: ReadonlyArray<CodeActionKind>;
    }

    /**
     * A code lens represents a [command](#Command) that should be shown along with
     * source text, like the number of references, a way to run tests, etc.
     *
     * A code lens is _unresolved_ when no command is associated to it. For performance
     * reasons the creation of a code lens and resolving should be done to two stages.
     *
     * @see [CodeLensProvider.provideCodeLenses](#CodeLensProvider.provideCodeLenses)
     * @see [CodeLensProvider.resolveCodeLens](#CodeLensProvider.resolveCodeLens)
     */
    export class CodeLens {

        /**
         * The range in which this code lens is valid. Should only span a single line.
         */
        range: Range;

        /**
         * The command this code lens represents.
         */
        command?: Command;

        /**
         * `true` when there is a command associated.
         */
        readonly isResolved: boolean;

        /**
         * Creates a new code lens object.
         *
         * @param range The range to which this code lens applies.
         * @param command The command associated to this code lens.
         */
        constructor(range: Range, command?: Command);
    }

    /**
     * A code lens provider adds [commands](#Command) to source text. The commands will be shown
     * as dedicated horizontal lines in between the source text.
     */
    export interface CodeLensProvider {
        /**
         * An optional event to signal that the code lenses from this provider have changed.
         */
        onDidChangeCodeLenses?: Event<void>;
        /**
         * Compute a list of [lenses](#CodeLens). This call should return as fast as possible and if
         * computing the commands is expensive implementors should only return code lens objects with the
         * range set and implement [resolve](#CodeLensProvider.resolveCodeLens).
         *
         * @param document The document in which the command was invoked.
         * @param token A cancellation token.
         * @return An array of code lenses or a thenable that resolves to such. The lack of a result can be
         * signaled by returning `undefined`, `null`, or an empty array.
         */
        provideCodeLenses(document: TextDocument, token: CancellationToken): ProviderResult<CodeLens[]>;
        /**
         * This function will be called for each visible code lens, usually when scrolling and after
         * calls to [compute](#CodeLensProvider.provideCodeLenses)-lenses.
         *
         * @param codeLens code lens that must be resolved.
         * @param token A cancellation token.
         * @return The given, resolved code lens or thenable that resolves to such.
         */
        resolveCodeLens?(codeLens: CodeLens, token: CancellationToken): ProviderResult<CodeLens>;
    }

    /**
     * Kind of a code action.
     *
     * Kinds are a hierarchical list of identifiers separated by `.`, e.g. `"refactor.extract.function"`.
     *
     * Code action kinds are used by VS Code for UI elements such as the refactoring context menu. Users
     * can also trigger code actions with a specific kind with the `editor.action.codeAction` command.
     */
    export class CodeActionKind {
        /**
         * Empty kind.
         */
        static readonly Empty: CodeActionKind;

        /**
         * Base kind for quickfix actions: `quickfix`.
         *
         * Quick fix actions address a problem in the code and are shown in the normal code action context menu.
         */
        static readonly QuickFix: CodeActionKind;

        /**
         * Base kind for refactoring actions: `refactor`
         *
         * Refactoring actions are shown in the refactoring context menu.
         */
        static readonly Refactor: CodeActionKind;

        /**
         * Base kind for refactoring extraction actions: `refactor.extract`
         *
         * Example extract actions:
         *
         * - Extract method
         * - Extract function
         * - Extract variable
         * - Extract interface from class
         * - ...
         */
        static readonly RefactorExtract: CodeActionKind;

        /**
         * Base kind for refactoring inline actions: `refactor.inline`
         *
         * Example inline actions:
         *
         * - Inline function
         * - Inline variable
         * - Inline constant
         * - ...
         */
        static readonly RefactorInline: CodeActionKind;

        /**
         * Base kind for refactoring rewrite actions: `refactor.rewrite`
         *
         * Example rewrite actions:
         *
         * - Convert JavaScript function to class
         * - Add or remove parameter
         * - Encapsulate field
         * - Make method static
         * - Move method to base class
         * - ...
         */
        static readonly RefactorRewrite: CodeActionKind;

        /**
         * Base kind for source actions: `source`
         *
         * Source code actions apply to the entire file and can be run on save
         * using `editor.codeActionsOnSave`. They also are shown in `source` context menu.
         */
        static readonly Source: CodeActionKind;

        /**
         * Base kind for an organize imports source action: `source.organizeImports`.
         */
        static readonly SourceOrganizeImports: CodeActionKind;

        private constructor(value: string);

        /**
         * String value of the kind, e.g. `"refactor.extract.function"`.
         */
        readonly value?: string;

        /**
         * Create a new kind by appending a more specific selector to the current kind.
         *
         * Does not modify the current kind.
         */
        append(parts: string): CodeActionKind;

        /**
         * Does this kind contain `other`?
         *
         * The kind `"refactor"` for example contains `"refactor.extract"` and ``"refactor.extract.function"`, but not `"unicorn.refactor.extract"` or `"refactory.extract"`
         *
         * @param other Kind to check.
         */
        contains(other: CodeActionKind): boolean;

        /**
         * Check if this code action kind intersects `other`.
         * The kind "refactor.extract" for example intersects refactor, "refactor.extract" and
         * `"refactor.extract.function", but not "unicorn.refactor.extract", or "refactor.extractAll".
         *
         * @param other Kind to check.
         */
        intersects(other: CodeActionKind): boolean;
    }

    /**
     * Contains additional diagnostic information about the context in which
     * a [code action](#CodeActionProvider.provideCodeActions) is run.
     */
    export interface CodeActionContext {
        /**
         * An array of diagnostics.
         */
        readonly diagnostics: Diagnostic[];

        /**
         * Requested kind of actions to return.
         *
         * Actions not of this kind are filtered out before being shown by the lightbulb.
         */
        readonly only?: CodeActionKind;
    }

    /**
     * A workspace edit is a collection of textual and files changes for
     * multiple resources and documents.
     *
     * Use the [applyEdit](#workspace.applyEdit)-function to apply a workspace edit.
     */
    export class WorkspaceEdit {

        /**
         * The number of affected resources of textual or resource changes.
         */
        readonly size: number;

        /**
         * Replace the given range with given text for the given resource.
         *
         * @param uri A resource identifier.
         * @param range A range.
         * @param newText A string.
         */
        replace(uri: Uri, range: Range, newText: string): void;

        /**
         * Insert the given text at the given position.
         *
         * @param uri A resource identifier.
         * @param position A position.
         * @param newText A string.
         */
        insert(uri: Uri, position: Position, newText: string): void;

        /**
         * Delete the text at the given range.
         *
         * @param uri A resource identifier.
         * @param range A range.
         */
        delete(uri: Uri, range: Range): void;

        /**
         * Check if a text edit for a resource exists.
         *
         * @param uri A resource identifier.
         * @return `true` if the given resource will be touched by this edit.
         */
        has(uri: Uri): boolean;

        /**
         * Set (and replace) text edits for a resource.
         *
         * @param uri A resource identifier.
         * @param edits An array of text edits.
         */
        set(uri: Uri, edits: TextEdit[]): void;

        /**
         * Get the text edits for a resource.
         *
         * @param uri A resource identifier.
         * @return An array of text edits.
         */
        get(uri: Uri): TextEdit[];

        /**
         * Create a regular file.
         *
         * @param uri Uri of the new file..
         * @param options Defines if an existing file should be overwritten or be
         * ignored. When overwrite and ignoreIfExists are both set overwrite wins.
         */
        createFile(uri: Uri, options?: { overwrite?: boolean, ignoreIfExists?: boolean }): void;

        /**
         * Delete a file or folder.
         *
         * @param uri The uri of the file that is to be deleted.
         */
        deleteFile(uri: Uri, options?: { recursive?: boolean, ignoreIfNotExists?: boolean }): void;

        /**
         * Rename a file or folder.
         *
         * @param oldUri The existing file.
         * @param newUri The new location.
         * @param options Defines if existing files should be overwritten or be
         * ignored. When overwrite and ignoreIfExists are both set overwrite wins.
         */
        renameFile(oldUri: Uri, newUri: Uri, options?: { overwrite?: boolean, ignoreIfExists?: boolean }): void;

        /**
         * Get all text edits grouped by resource.
         *
         * @return A shallow copy of `[Uri, TextEdit[]]`-tuples.
         */
        entries(): [Uri, TextEdit[]][];
    }

    /**
     * The document formatting provider interface defines the contract between extensions and
     * the formatting-feature.
     */
    export interface DocumentFormattingEditProvider {

        /**
         * Provide formatting edits for a whole document.
         *
         * @param document The document in which the command was invoked.
         * @param options Options controlling formatting.
         * @param token A cancellation token.
         * @return A set of text edits or a thenable that resolves to such. The lack of a result can be
         * signaled by returning `undefined`, `null`, or an empty array.
         */
        provideDocumentFormattingEdits(
            document: TextDocument,
            options: FormattingOptions,
            token: CancellationToken | undefined
        ): ProviderResult<TextEdit[] | undefined>;
    }

    /**
     * The document formatting provider interface defines the contract between extensions and
     * the formatting-feature.
     */
    export interface DocumentRangeFormattingEditProvider {

        /**
         * Provide formatting edits for a range in a document.
         *
         * The given range is a hint and providers can decide to format a smaller
         * or larger range. Often this is done by adjusting the start and end
         * of the range to full syntax nodes.
         *
         * @param document The document in which the command was invoked.
         * @param range The range which should be formatted.
         * @param options Options controlling formatting.
         * @param token A cancellation token.
         * @return A set of text edits or a thenable that resolves to such. The lack of a result can be
         * signaled by returning `undefined`, `null`, or an empty array.
         */
        provideDocumentRangeFormattingEdits(
            document: TextDocument,
            range: Range,
            options: FormattingOptions,
            token: CancellationToken | undefined
        ): ProviderResult<TextEdit[] | undefined>;
    }

    /**
     * Value-object describing what options formatting should use.
     */
    export interface FormattingOptions {

        /**
         * Size of a tab in spaces.
         */
        tabSize: number;

        /**
         * Prefer spaces over tabs.
         */
        insertSpaces: boolean;

        /**
         * Signature for further properties.
         */
        [key: string]: boolean | number | string;
    }

    /**
     * The document formatting provider interface defines the contract between extensions and
     * the formatting-feature.
     */
    export interface OnTypeFormattingEditProvider {

        /**
         * Provide formatting edits after a character has been typed.
         *
         * The given position and character should hint to the provider
         * what range the position to expand to, like find the matching `{`
         * when `}` has been entered.
         *
         * @param document The document in which the command was invoked.
         * @param position The position at which the command was invoked.
         * @param ch The character that has been typed.
         * @param options Options controlling formatting.
         * @param token A cancellation token.
         * @return A set of text edits or a thenable that resolves to such. The lack of a result can be
         * signaled by returning `undefined`, `null`, or an empty array.
         */
        provideOnTypeFormattingEdits(document: TextDocument,
            position: Position,
            ch: string,
            options: FormattingOptions,
            token: CancellationToken | undefined
        ): ProviderResult<TextEdit[] | undefined>;
    }

    /**
     * A document link is a range in a text document that links to an internal or external resource, like another
     * text document or a web site.
     */
    export class DocumentLink {

        /**
         * The range this link applies to.
         */
        range: Range;

        /**
         * The uri this link points to.
         */
        target?: Uri;

        /**
         * Creates a new document link.
         *
         * @param range The range the document link applies to. Must not be empty.
         * @param target The uri the document link points to.
         */
        constructor(range: Range, target?: Uri);
    }

    /**
     * The document link provider defines the contract between extensions and feature of showing
     * links in the editor.
     */
    export interface DocumentLinkProvider {

        /**
         * Provide links for the given document. Note that the editor ships with a default provider that detects
         * `http(s)` and `file` links.
         *
         * @param document The document in which the command was invoked.
         * @param token A cancellation token.
         * @return An array of [document links](#DocumentLink) or a thenable that resolves to such. The lack of a result
         * can be signaled by returning `undefined`, `null`, or an empty array.
         */
        provideDocumentLinks(document: TextDocument, token: CancellationToken | undefined): ProviderResult<DocumentLink[]>;

        /**
         * Given a link fill in its [target](#DocumentLink.target). This method is called when an incomplete
         * link is selected in the UI. Providers can implement this method and return incomplete links
         * (without target) from the [`provideDocumentLinks`](#DocumentLinkProvider.provideDocumentLinks) method which
         * often helps to improve performance.
         *
         * @param link The link that is to be resolved.
         * @param token A cancellation token.
         */
        resolveDocumentLink?(link: DocumentLink, token: CancellationToken | undefined): ProviderResult<DocumentLink>;
    }

    /**
    * The rename provider interface defines the contract between extensions and
    * the [rename](https://code.visualstudio.com/docs/editor/editingevolved#_rename-symbol)-feature.
    */
    export interface RenameProvider {

        /**
        * Provide an edit that describes changes that have to be made to one
        * or many resources to rename a symbol to a different name.
        *
        * @param document The document in which the command was invoked.
        * @param position The position at which the command was invoked.
        * @param newName The new name of the symbol. If the given name is not valid, the provider must return a rejected promise.
        * @param token A cancellation token.
        * @return A workspace edit or a thenable that resolves to such. The lack of a result can be
        * signaled by returning `undefined` or `null`.
        */
        provideRenameEdits(document: TextDocument, position: Position, newName: string, token: CancellationToken): ProviderResult<WorkspaceEdit>;

        /**
        * Optional function for resolving and validating a position *before* running rename. The result can
        * be a range or a range and a placeholder text. The placeholder text should be the identifier of the symbol
        * which is being renamed - when omitted the text in the returned range is used.
        *
        * @param document The document in which rename will be invoked.
        * @param position The position at which rename will be invoked.
        * @param token A cancellation token.
        * @return The range or range and placeholder text of the identifier that is to be renamed. The lack of a result can signaled by returning `undefined` or `null`.
        */
        prepareRename?(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Range | { range: Range, placeholder: string }>;
    }

    export namespace languages {
        /**
         * Return the identifiers of all known languages.
         * @return Promise resolving to an array of identifier strings.
         */
        export function getLanguages(): PromiseLike<string[]>;

        /**
         * Set (and change) the [language](#TextDocument.languageId) that is associated
         * with the given document.
         *
         * *Note* that calling this function will trigger the [`onDidCloseTextDocument`](#workspace.onDidCloseTextDocument) event
         * followed by the [`onDidOpenTextDocument`](#workspace.onDidOpenTextDocument) event.
         *
         * @param document The document which language is to be changed
         * @param languageId The new language identifier.
         * @returns A thenable that resolves with the updated document.
         */
        export function setTextDocumentLanguage(document: TextDocument, languageId: string): PromiseLike<TextDocument>;

        /**
         * Compute the match between a document [selector](#DocumentSelector) and a document. Values
         * greater than zero mean the selector matches the document.
         *
         * A match is computed according to these rules:
         * 1. When [`DocumentSelector`](#DocumentSelector) is an array, compute the match for each contained `DocumentFilter` or language identifier and take the maximum value.
         * 2. A string will be desugared to become the `language`-part of a [`DocumentFilter`](#DocumentFilter), so `"fooLang"` is like `{ language: "fooLang" }`.
         * 3. A [`DocumentFilter`](#DocumentFilter) will be matched against the document by comparing its parts with the document. The following rules apply:
         *  1. When the `DocumentFilter` is empty (`{}`) the result is `0`
         *  2. When `scheme`, `language`, or `pattern` are defined but one doesn’t match, the result is `0`
         *  3. Matching against `*` gives a score of `5`, matching via equality or via a glob-pattern gives a score of `10`
         *  4. The result is the maximum value of each match
         *
         * Samples:
         * ```js
         * // default document from disk (file-scheme)
         * doc.uri; //'file:///my/file.js'
         * doc.languageId; // 'javascript'
         * match('javascript', doc); // 10;
         * match({language: 'javascript'}, doc); // 10;
         * match({language: 'javascript', scheme: 'file'}, doc); // 10;
         * match('*', doc); // 5
         * match('fooLang', doc); // 0
         * match(['fooLang', '*'], doc); // 5
         *
         * // virtual document, e.g. from git-index
         * doc.uri; // 'git:/my/file.js'
         * doc.languageId; // 'javascript'
         * match('javascript', doc); // 10;
         * match({language: 'javascript', scheme: 'git'}, doc); // 10;
         * match('*', doc); // 5
         * ```
         *
         * @param selector A document selector.
         * @param document A text document.
         * @return A number `>0` when the selector matches and `0` when the selector does not match.
         */
        export function match(selector: DocumentSelector, document: TextDocument): number;

        /**
         * An [event](#Event) which fires when the global set of diagnostics changes. This is
         * newly added and removed diagnostics.
         */
        export const onDidChangeDiagnostics: Event<DiagnosticChangeEvent>;

        /**
         * Get all diagnostics for a given resource. *Note* that this includes diagnostics from
         * all extensions but *not yet* from the task framework.
         *
         * @param resource A resource
         * @returns An array of [diagnostics](#Diagnostic) objects or an empty array.
         */
        export function getDiagnostics(resource: Uri): Diagnostic[];

        /**
         * Get all diagnostics. *Note* that this includes diagnostics from
         * all extensions but *not yet* from the task framework.
         *
         * @returns An array of uri-diagnostics tuples or an empty array.
         */
        export function getDiagnostics(): [Uri, Diagnostic[]][];

        /**
         * Create a diagnostics collection.
         *
         * @param name The [name](#DiagnosticCollection.name) of the collection.
         * @return A new diagnostic collection.
         */
        export function createDiagnosticCollection(name?: string): DiagnosticCollection;

        /**
         * Set a [language configuration](#LanguageConfiguration) for a language.
         *
         * @param language A language identifier like `typescript`.
         * @param configuration Language configuration.
         * @return A [disposable](#Disposable) that unsets this configuration.
         */
        export function setLanguageConfiguration(language: string, configuration: LanguageConfiguration): Disposable;

        /**
         * Register a completion provider.
         *
         * Multiple providers can be registered for a language. In that case providers are sorted
         * by their [score](#languages.match) and groups of equal score are sequentially asked for
         * completion items. The process stops when one or many providers of a group return a
         * result. A failing provider (rejected promise or exception) will not fail the whole
         * operation.
         *
         * @param selector A selector that defines the documents this provider is applicable to.
         * @param provider A completion provider.
         * @param triggerCharacters Trigger completion when the user types one of the characters, like `.` or `:`.
         * @return A [disposable](#Disposable) that unregisters this provider when being disposed.
         */
        export function registerCompletionItemProvider(selector: DocumentSelector, provider: CompletionItemProvider, ...triggerCharacters: string[]): Disposable;

        /**
         * Register a definition provider.
         *
         * Multiple providers can be registered for a language. In that case providers are asked in
         * parallel and the results are merged. A failing provider (rejected promise or exception) will
         * not cause a failure of the whole operation.
         *
         * @param selector A selector that defines the documents this provider is applicable to.
         * @param provider A definition provider.
         * @return A [disposable](#Disposable) that unregisters this provider when being disposed.
         */
        export function registerDefinitionProvider(selector: DocumentSelector, provider: DefinitionProvider): Disposable;

        /**
         * Register a signature help provider.
         *
         * Multiple providers can be registered for a language. In that case providers are sorted
         * by their [score](#languages.match) and called sequentially until a provider returns a
         * valid result.
         *
         * @param selector A selector that defines the documents this provider is applicable to.
         * @param provider A signature help provider.
         * @param triggerCharacters Trigger signature help when the user types one of the characters, like `,` or `(`.
         * @return A [disposable](#Disposable) that unregisters this provider when being disposed.
         */
        export function registerSignatureHelpProvider(selector: DocumentSelector, provider: SignatureHelpProvider, ...triggerCharacters: string[]): Disposable;

        /**
         * Register a type definition provider.
         *
         * Multiple providers can be registered for a language. In that case providers are asked in
         * parallel and the results are merged. A failing provider (rejected promise or exception) will
         * not cause a failure of the whole operation.
         *
         * @param selector A selector that defines the documents this provider is applicable to.
         * @param provider A type definition provider.
         * @return A [disposable](#Disposable) that unregisters this provider when being disposed.
         */
        export function registerTypeDefinitionProvider(selector: DocumentSelector, provider: TypeDefinitionProvider): Disposable;

        /**
         * Register an implementation provider.
         *
         * Multiple providers can be registered for a language. In that case providers are asked in
         * parallel and the results are merged. A failing provider (rejected promise or exception) will
         * not cause a failure of the whole operation.
         *
         * @param selector A selector that defines the documents this provider is applicable to.
         * @param provider An implementation provider.
         * @return A [disposable](#Disposable) that unregisters this provider when being disposed.
         */
        export function registerImplementationProvider(selector: DocumentSelector, provider: ImplementationProvider): Disposable;

        /**
         * Register a hover provider.
         *
         * Multiple providers can be registered for a language. In that case providers are asked in
         * parallel and the results are merged. A failing provider (rejected promise or exception) will
         * not cause a failure of the whole operation.
         *
         * @param selector A selector that defines the documents this provider is applicable to.
         * @param provider A hover provider.
         * @return A [disposable](#Disposable) that unregisters this provider when being disposed.
         */
        export function registerHoverProvider(selector: DocumentSelector, provider: HoverProvider): Disposable;

        /**
         * Register a workspace symbol provider.
         *
         * Multiple providers can be registered for a language. In that case providers are asked in
         * parallel and the results are merged. A failing provider (rejected promise or exception) will
         * not cause a failure of the whole operation.
         *
         * @param provider A workspace symbol provider.
         * @return A [disposable](#Disposable) that unregisters this provider when being disposed.
         */
        export function registerWorkspaceSymbolProvider(provider: WorkspaceSymbolProvider): Disposable;

        /**
         * Register a document highlight provider.
         *
         * Multiple providers can be registered for a language. In that case providers are sorted
         * by their [score](#languages.match) and groups sequentially asked for document highlights.
         * The process stops when a provider returns a `non-falsy` or `non-failure` result.
         *
         * @param selector A selector that defines the documents this provider is applicable to.
         * @param provider A document highlight provider.
         * @return A [disposable](#Disposable) that unregisters this provider when being disposed.
         */
        export function registerDocumentHighlightProvider(selector: DocumentSelector, provider: DocumentHighlightProvider): Disposable;

        /**
         * Register a formatting provider for a document.
         *
         * Multiple providers can be registered for a language. In that case providers are sorted
         * by their [score](#languages.match) and the best-matching provider is used. Failure
         * of the selected provider will cause a failure of the whole operation.
         *
         * @param selector A selector that defines the documents this provider is applicable to.
         * @param provider A document formatting edit provider.
         * @return A [disposable](#Disposable) that unregisters this provider when being disposed.
         */
        export function registerDocumentFormattingEditProvider(selector: DocumentSelector, provider: DocumentFormattingEditProvider): Disposable;

        /**
         * Register a formatting provider for a document range.
         *
         * *Note:* A document range provider is also a [document formatter](#DocumentFormattingEditProvider)
         * which means there is no need to [register](#registerDocumentFormattingEditProvider) a document
         * formatter when also registering a range provider.
         *
         * Multiple providers can be registered for a language. In that case providers are sorted
         * by their [score](#languages.match) and the best-matching provider is used. Failure
         * of the selected provider will cause a failure of the whole operation.
         *
         * @param selector A selector that defines the documents this provider is applicable to.
         * @param provider A document range formatting edit provider.
         * @return A [disposable](#Disposable) that unregisters this provider when being disposed.
         */
        export function registerDocumentRangeFormattingEditProvider(selector: DocumentSelector, provider: DocumentRangeFormattingEditProvider): Disposable;

        /**
         * Register a code action provider.
         *
         * Multiple providers can be registered for a language. In that case providers are asked in
         * parallel and the results are merged. A failing provider (rejected promise or exception) will
         * not cause a failure of the whole operation.
         *
         * @param selector A selector that defines the documents this provider is applicable to.
         * @param provider A code action provider.
         * @param metadata Metadata about the kind of code actions the provider providers.
         * @return A [disposable](#Disposable) that unregisters this provider when being disposed.
         */
        export function registerCodeActionsProvider(selector: DocumentSelector, provider: CodeActionProvider, metadata?: CodeActionProviderMetadata): Disposable;

        /**
         * Register a code lens provider.
         *
         * Multiple providers can be registered for a language. In that case providers are asked in
         * parallel and the results are merged. A failing provider (rejected promise or exception) will
         * not cause a failure of the whole operation.
         *
         * @param selector A selector that defines the documents this provider is applicable to.
         * @param provider A code lens provider.
         * @return A [disposable](#Disposable) that unregisters this provider when being disposed.
         */
        export function registerCodeLensProvider(selector: DocumentSelector, provider: CodeLensProvider): Disposable;

        /**
         * Register a formatting provider that works on type. The provider is active when the user enables the setting `editor.formatOnType`.
         *
         * Multiple providers can be registered for a language. In that case providers are sorted
         * by their [score](#languages.match) and the best-matching provider is used. Failure
         * of the selected provider will cause a failure of the whole operation.
         *
         * @param selector A selector that defines the documents this provider is applicable to.
         * @param provider An on type formatting edit provider.
         * @param firstTriggerCharacter A character on which formatting should be triggered, like `}`.
         * @param moreTriggerCharacter More trigger characters.
         * @return A [disposable](#Disposable) that unregisters this provider when being disposed.
         */
        export function registerOnTypeFormattingEditProvider(
            selector: DocumentSelector,
            provider: OnTypeFormattingEditProvider,
            firstTriggerCharacter: string,
            ...moreTriggerCharacter: string[]
        ): Disposable;

        /**
         * Register a document link provider.
         *
         * Multiple providers can be registered for a language. In that case providers are asked in
         * parallel and the results are merged. A failing provider (rejected promise or exception) will
         * not cause a failure of the whole operation.
         *
         * @param selector A selector that defines the documents this provider is applicable to.
         * @param provider A document link provider.
         * @return A [disposable](#Disposable) that unregisters this provider when being disposed.
         */
        export function registerDocumentLinkProvider(selector: DocumentSelector, provider: DocumentLinkProvider): Disposable;

        /**
         * Register a reference provider.
         *
         * Multiple providers can be registered for a language. In that case providers are asked in
         * parallel and the results are merged. A failing provider (rejected promise or exception) will
         * not cause a failure of the whole operation.
         *
         * @param selector A selector that defines the documents this provider is applicable to.
         * @param provider A reference provider.
         * @return A [disposable](#Disposable) that unregisters this provider when being disposed.
         */
        export function registerReferenceProvider(selector: DocumentSelector, provider: ReferenceProvider): Disposable;

        /**
         * Register a document symbol provider.
         *
         * Multiple providers can be registered for a language. In that case providers are asked in
         * parallel and the results are merged. A failing provider (rejected promise or exception) will
         * not cause a failure of the whole operation.
         *
         * @param selector A selector that defines the documents this provider is applicable to.
         * @param provider A document symbol provider.
         * @return A [disposable](#Disposable) that unregisters this provider when being disposed.
         */
        export function registerDocumentSymbolProvider(selector: DocumentSelector, provider: DocumentSymbolProvider): Disposable;

        /**
        * Register a color provider.
        *
        * Multiple providers can be registered for a language. In that case providers are asked in
        * parallel and the results are merged. A failing provider (rejected promise or exception) will
        * not cause a failure of the whole operation.
        *
        * @param selector A selector that defines the documents this provider is applicable to.
        * @param provider A color provider.
        * @return A [disposable](#Disposable) that unregisters this provider when being disposed.
        */
        export function registerColorProvider(selector: DocumentSelector, provider: DocumentColorProvider): Disposable;

        /**
        * Register a folding range provider.
        *
        * Multiple providers can be registered for a language. In that case providers are asked in
        * parallel and the results are merged.
        * If multiple folding ranges start at the same position, only the range of the first registered provider is used.
        * If a folding range overlaps with an other range that has a smaller position, it is also ignored.
        *
        * A failing provider (rejected promise or exception) will
        * not cause a failure of the whole operation.
        *
        * @param selector A selector that defines the documents this provider is applicable to.
        * @param provider A folding range provider.
        * @return A [disposable](#Disposable) that unregisters this provider when being disposed.
        */
        export function registerFoldingRangeProvider(selector: DocumentSelector, provider: FoldingRangeProvider): Disposable;

        /**
        * Register a reference provider.
        *
        * Multiple providers can be registered for a language. In that case providers are sorted
        * by their [score](#languages.match) and the best-matching provider is used. Failure
        * of the selected provider will cause a failure of the whole operation.
        *
        * @param selector A selector that defines the documents this provider is applicable to.
        * @param provider A rename provider.
        * @return A [disposable](#Disposable) that unregisters this provider when being disposed.
        */
        export function registerRenameProvider(selector: DocumentSelector, provider: RenameProvider): Disposable;
    }

    /**
     * A hover represents additional information for a symbol or word. Hovers are
     * rendered in a tooltip-like widget.
     */
    export class Hover {

        /**
         * The contents of this hover.
         */
        contents: MarkedString[];

        /**
         * The range to which this hover applies. When missing, the
         * editor will use the range at the current position or the
         * current position itself.
         */
        range?: Range;

        /**
         * Creates a new hover object.
         *
         * @param contents The contents of the hover.
         * @param range The range to which the hover applies.
         */
        constructor(contents: MarkedString | MarkedString[], range?: Range);
    }

    /**
     * The hover provider interface defines the contract between extensions and
     * the [hover](https://code.visualstudio.com/docs/editor/intellisense)-feature.
     */
    export interface HoverProvider {

        /**
         * Provide a hover for the given position and document. Multiple hovers at the same
         * position will be merged by the editor. A hover can have a range which defaults
         * to the word range at the position when omitted.
         *
         * @param document The document in which the command was invoked.
         * @param position The position at which the command was invoked.
         * @param token A cancellation token.
         * @return A hover or a thenable that resolves to such. The lack of a result can be
         * signaled by returning `undefined` or `null`.
         */
        provideHover(document: TextDocument, position: Position, token: CancellationToken | undefined): ProviderResult<Hover>;
    }

    /**
     * A document highlight kind.
     */
    export enum DocumentHighlightKind {

        /**
         * A textual occurrence.
         */
        Text = 0,

        /**
         * Read-access of a symbol, like reading a variable.
         */
        Read = 1,

        /**
         * Write-access of a symbol, like writing to a variable.
         */
        Write = 2
    }

    /**
     * A document highlight is a range inside a text document which deserves
     * special attention. Usually a document highlight is visualized by changing
     * the background color of its range.
     */
    export class DocumentHighlight {

        /**
         * The range this highlight applies to.
         */
        range: Range;

        /**
         * The highlight kind, default is [text](#DocumentHighlightKind.Text).
         */
        kind?: DocumentHighlightKind;

        /**
         * Creates a new document highlight object.
         *
         * @param range The range the highlight applies to.
         * @param kind The highlight kind, default is [text](#DocumentHighlightKind.Text).
         */
        constructor(range: Range, kind?: DocumentHighlightKind);
    }

    /**
     * The document highlight provider interface defines the contract between extensions and
     * the word-highlight-feature.
     */
    export interface DocumentHighlightProvider {

        /**
         * Provide a set of document highlights, like all occurrences of a variable or
         * all exit-points of a function.
         *
         * @param document The document in which the command was invoked.
         * @param position The position at which the command was invoked.
         * @param token A cancellation token.
         * @return An array of document highlights or a thenable that resolves to such. The lack of a result can be
         * signaled by returning `undefined`, `null`, or an empty array.
         */
        provideDocumentHighlights(document: TextDocument, position: Position, token: CancellationToken | undefined): ProviderResult<DocumentHighlight[]>;
    }

    /**
     * Represents the input box in the Source Control viewlet.
     */
    export interface SourceControlInputBox {

        /**
         * Setter and getter for the contents of the input box.
         */
        value: string;

        /**
         * A string to show as place holder in the input box to guide the user.
         */
        placeholder: string;
    }

    interface QuickDiffProvider {

        /**
         * Provide a [uri](#Uri) to the original resource of any given resource uri.
         *
         * @param uri The uri of the resource open in a text editor.
         * @param token A cancellation token.
         * @return A thenable that resolves to uri of the matching original resource.
         */
        provideOriginalResource?(uri: Uri, token: CancellationToken): ProviderResult<Uri>;
    }

    /**
     * The theme-aware decorations for a
     * [source control resource state](#SourceControlResourceState).
     */
    export interface SourceControlResourceThemableDecorations {

        /**
         * The icon path for a specific
         * [source control resource state](#SourceControlResourceState).
         */
        readonly iconPath?: string | Uri;
    }

    /**
     * The decorations for a [source control resource state](#SourceControlResourceState).
     * Can be independently specified for light and dark themes.
     */
    export interface SourceControlResourceDecorations extends SourceControlResourceThemableDecorations {

        /**
         * Whether the [source control resource state](#SourceControlResourceState) should
         * be striked-through in the UI.
         */
        readonly strikeThrough?: boolean;

        /**
         * Whether the [source control resource state](#SourceControlResourceState) should
         * be faded in the UI.
         */
        readonly faded?: boolean;

        /**
         * The title for a specific
         * [source control resource state](#SourceControlResourceState).
         */
        readonly tooltip?: string;

        /**
         * The light theme decorations.
         */
        readonly light?: SourceControlResourceThemableDecorations;

        /**
         * The dark theme decorations.
         */
        readonly dark?: SourceControlResourceThemableDecorations;
    }

    /**
     * An source control resource state represents the state of an underlying workspace
     * resource within a certain [source control group](#SourceControlResourceGroup).
     */
    export interface SourceControlResourceState {

        /**
         * The [uri](#Uri) of the underlying resource inside the workspace.
         */
        readonly resourceUri: Uri;

        /**
         * The [command](#Command) which should be run when the resource
         * state is open in the Source Control viewlet.
         */
        readonly command?: Command;

        /**
         * The [decorations](#SourceControlResourceDecorations) for this source control
         * resource state.
         */
        readonly decorations?: SourceControlResourceDecorations;
    }

    /**
     * A source control resource group is a collection of
     * [source control resource states](#SourceControlResourceState).
     */
    export interface SourceControlResourceGroup {

        /**
         * The id of this source control resource group.
         */
        readonly id: string;

        /**
         * The label of this source control resource group.
         */
        label: string;

        /**
         * Whether this source control resource group is hidden when it contains
         * no [source control resource states](#SourceControlResourceState).
         */
        hideWhenEmpty?: boolean;

        /**
         * This group's collection of
         * [source control resource states](#SourceControlResourceState).
         */
        resourceStates: SourceControlResourceState[];

        /**
         * Dispose this source control resource group.
         */
        dispose(): void;
    }

    /**
     * An source control is able to provide [resource states](#SourceControlResourceState)
     * to the editor and interact with the editor in several source control related ways.
     */
    export interface SourceControl {

        /**
         * The id of this source control.
         */
        readonly id: string;

        /**
         * The human-readable label of this source control.
         */
        readonly label: string;

        /**
         * The (optional) Uri of the root of this source control.
         */
        readonly rootUri: Uri | undefined;

        /**
         * The [input box](#SourceControlInputBox) for this source control.
         */
        readonly inputBox: SourceControlInputBox;

        /**
         * The UI-visible count of [resource states](#SourceControlResourceState) of
         * this source control.
         *
         * Equals to the total number of [resource state](#SourceControlResourceState)
         * of this source control, if undefined.
         */
        count?: number;

        /**
         * An optional [quick diff provider](#QuickDiffProvider).
         */
        quickDiffProvider?: QuickDiffProvider;

        /**
         * Optional commit template string.
         *
         * The Source Control viewlet will populate the Source Control
         * input with this value when appropriate.
         */
        commitTemplate?: string;

        /**
         * Optional accept input command.
         *
         * This command will be invoked when the user accepts the value
         * in the Source Control input.
         */
        acceptInputCommand?: Command;

        /**
         * Optional status bar commands.
         *
         * These commands will be displayed in the editor's status bar.
         */
        statusBarCommands?: Command[];

        /**
         * Create a new [resource group](#SourceControlResourceGroup).
         */
        createResourceGroup(id: string, label: string): SourceControlResourceGroup;

        /**
         * Dispose this source control.
         */
        dispose(): void;
    }

    export namespace scm {

        /**
         * ~~The [input box](#SourceControlInputBox) for the last source control
         * created by the extension.~~
         *
         * @deprecated Use SourceControl.inputBox instead
         */
        export const inputBox: SourceControlInputBox;

        /**
         * Creates a new [source control](#SourceControl) instance.
         *
         * @param id An `id` for the source control. Something short, eg: `git`.
         * @param label A human-readable string for the source control. Eg: `Git`.
         * @param rootUri An optional Uri of the root of the source control. Eg: `Uri.parse(workspaceRoot)`.
         * @return An instance of [source control](#SourceControl).
         */
        export function createSourceControl(id: string, label: string, rootUri?: Uri): SourceControl;
    }

    /**
     * Configuration for a debug session.
     */
    export interface DebugConfiguration {
        /**
         * The type of the debug session.
         */
        type: string;

        /**
         * The name of the debug session.
         */
        name: string;

        /**
         * The request type of the debug session.
         */
        request: string;

        /**
         * Additional debug type specific properties.
         */
        [key: string]: any;
    }

    /**
 * A debug session.
 */
    export interface DebugSession {

        /**
         * The unique ID of this debug session.
         */
        readonly id: string;

        /**
         * The debug session's type from the [debug configuration](#DebugConfiguration).
         */
        readonly type: string;

        /**
         * The debug session's name from the [debug configuration](#DebugConfiguration).
         */
        readonly name: string;

        /**
         * Send a custom request to the debug adapter.
         */
        customRequest(command: string, args?: any): PromiseLike<any>;
    }

    /**
     * A custom Debug Adapter Protocol event received from a [debug session](#DebugSession).
     */
    export interface DebugSessionCustomEvent {
        /**
         * The [debug session](#DebugSession) for which the custom event was received.
         */
        session: DebugSession;

        /**
         * Type of event.
         */
        event: string;

        /**
         * Event specific information.
         */
        body?: any;
    }

    /**
     * A debug configuration provider allows to add the initial debug configurations to a newly created launch.json
     * and to resolve a launch configuration before it is used to start a new debug session.
     * A debug configuration provider is registered via #debug.registerDebugConfigurationProvider.
     */
    export interface DebugConfigurationProvider {
        /**
         * Provides initial [debug configuration](#DebugConfiguration). If more than one debug configuration provider is
         * registered for the same type, debug configurations are concatenated in arbitrary order.
         *
         * @param folder The workspace folder for which the configurations are used or undefined for a folderless setup.
         * @param token A cancellation token.
         * @return An array of [debug configurations](#DebugConfiguration).
         */
        provideDebugConfigurations?(folder: WorkspaceFolder | undefined, token?: CancellationToken): ProviderResult<DebugConfiguration[]>;

        /**
         * Resolves a [debug configuration](#DebugConfiguration) by filling in missing values or by adding/changing/removing attributes.
         * If more than one debug configuration provider is registered for the same type, the resolveDebugConfiguration calls are chained
         * in arbitrary order and the initial debug configuration is piped through the chain.
         * Returning the value 'undefined' prevents the debug session from starting.
         * Returning the value 'null' prevents the debug session from starting and opens the underlying debug configuration instead.
         *
         * @param folder The workspace folder from which the configuration originates from or undefined for a folderless setup.
         * @param debugConfiguration The [debug configuration](#DebugConfiguration) to resolve.
         * @param token A cancellation token.
         * @return The resolved debug configuration or undefined or null.
         */
        resolveDebugConfiguration?(folder: WorkspaceFolder | undefined, debugConfiguration: DebugConfiguration, token?: CancellationToken): ProviderResult<DebugConfiguration>;
    }

	/**
	 * A Debug Adapter Tracker is a means to track the communication between VS Code and a Debug Adapter.
	 */
    export interface DebugAdapterTracker {
        /**
         * A session with the debug adapter is about to be started.
         */
        onWillStartSession?(): void;
        /**
         * The debug adapter is about to receive a Debug Adapter Protocol message from VS Code.
         */
        onWillReceiveMessage?(message: any): void;
        /**
         * The debug adapter has sent a Debug Adapter Protocol message to VS Code.
         */
        onDidSendMessage?(message: any): void;
        /**
         * The debug adapter session is about to be stopped.
         */
        onWillStopSession?(): void;
        /**
         * An error with the debug adapter has occurred.
         */
        onError?(error: Error): void;
        /**
         * The debug adapter has exited with the given exit code or signal.
         */
        onExit?(code: number | undefined, signal: string | undefined): void;
    }

    export interface DebugAdapterTrackerFactory {
        /**
         * The method 'createDebugAdapterTracker' is called at the start of a debug session in order
         * to return a "tracker" object that provides read-access to the communication between VS Code and a debug adapter.
         *
         * @param session The [debug session](#DebugSession) for which the debug adapter tracker will be used.
         * @return A [debug adapter tracker](#DebugAdapterTracker) or undefined.
         */
        createDebugAdapterTracker(session: DebugSession): ProviderResult<DebugAdapterTracker>;
    }

    /**
     * Represents a debug adapter executable and optional arguments and runtime options passed to it.
     */
    export class DebugAdapterExecutable {

        /**
         * Creates a description for a debug adapter based on an executable program.
         *
         * @param command The command or executable path that implements the debug adapter.
         * @param args Optional arguments to be passed to the command or executable.
         * @param options Optional options to be used when starting the command or executable.
         */
        constructor(command: string, args?: string[], options?: DebugAdapterExecutableOptions);

        /**
         * The command or path of the debug adapter executable.
         * A command must be either an absolute path of an executable or the name of an command to be looked up via the PATH environment variable.
         * The special value 'node' will be mapped to VS Code's built-in Node.js runtime.
         */
        readonly command: string;

        /**
         * The arguments passed to the debug adapter executable. Defaults to an empty array.
         */
        readonly args: string[];

        /**
         * Optional options to be used when the debug adapter is started.
         * Defaults to undefined.
         */
        readonly options?: DebugAdapterExecutableOptions;
    }

	/**
	 * Options for a debug adapter executable.
	 */
    export interface DebugAdapterExecutableOptions {

        /**
         * The additional environment of the executed program or shell. If omitted
         * the parent process' environment is used. If provided it is merged with
         * the parent process' environment.
         */
        env?: { [key: string]: string };

        /**
         * The current working directory for the executed debug adapter.
         */
        cwd?: string;
    }

    /**
     * Represents a debug adapter running as a socket based server.
     */
    export class DebugAdapterServer {

        /**
         * The port.
         */
        readonly port: number;

        /**
         * The host.
         */
        readonly host?: string;

        /**
         * Create a description for a debug adapter running as a socket based server.
         */
        constructor(port: number, host?: string);
    }

    export type DebugAdapterDescriptor = DebugAdapterExecutable | DebugAdapterServer;

    export interface DebugAdapterDescriptorFactory {
        /**
         * 'createDebugAdapterDescriptor' is called at the start of a debug session to provide details about the debug adapter to use.
         * These details must be returned as objects of type [DebugAdapterDescriptor](#DebugAdapterDescriptor).
         * Currently two types of debug adapters are supported:
         * - a debug adapter executable is specified as a command path and arguments (see [DebugAdapterExecutable](#DebugAdapterExecutable)),
         * - a debug adapter server reachable via a communication port (see [DebugAdapterServer](#DebugAdapterServer)).
         * If the method is not implemented the default behavior is this:
         *   createDebugAdapter(session: DebugSession, executable: DebugAdapterExecutable) {
         *      if (typeof session.configuration.debugServer === 'number') {
         *         return new DebugAdapterServer(session.configuration.debugServer);
         *      }
         *      return executable;
         *   }
         * @param session The [debug session](#DebugSession) for which the debug adapter will be used.
         * @param executable The debug adapter's executable information as specified in the package.json (or undefined if no such information exists).
         * @return a [debug adapter descriptor](#DebugAdapterDescriptor) or undefined.
         */
        createDebugAdapterDescriptor(session: DebugSession, executable: DebugAdapterExecutable | undefined): ProviderResult<DebugAdapterDescriptor>;
    }

    /**
     * Represents the debug console.
     */
    export interface DebugConsole {
        /**
         * Append the given value to the debug console.
         *
         * @param value A string, falsy values will not be printed.
         */
        append(value: string): void;

        /**
         * Append the given value and a line feed character
         * to the debug console.
         *
         * @param value A string, falsy values will be printed.
         */
        appendLine(value: string): void;
    }

    /**
     * An event describing the changes to the set of [breakpoints](#Breakpoint).
     */
    export interface BreakpointsChangeEvent {
        /**
         * Added breakpoints.
         */
        readonly added: Breakpoint[];

        /**
         * Removed breakpoints.
         */
        readonly removed: Breakpoint[];

        /**
         * Changed breakpoints.
         */
        readonly changed: Breakpoint[];
    }

    /**
     * The base class of all breakpoint types.
     */
    export class Breakpoint {
        /**
         * The unique ID of the breakpoint.
         */
        readonly id: string;
        /**
         * Is breakpoint enabled.
         */
        readonly enabled: boolean;
        /**
         * An optional expression for conditional breakpoints.
         */
        readonly condition?: string;
        /**
         * An optional expression that controls how many hits of the breakpoint are ignored.
         */
        readonly hitCondition?: string;
        /**
         * An optional message that gets logged when this breakpoint is hit. Embedded expressions within {} are interpolated by the debug adapter.
         */
        readonly logMessage?: string;

        protected constructor(enabled?: boolean, condition?: string, hitCondition?: string, logMessage?: string);
    }

    /**
     * A breakpoint specified by a source location.
     */
    export class SourceBreakpoint extends Breakpoint {
        /**
         * The source and line position of this breakpoint.
         */
        readonly location: Location;

        /**
         * Create a new breakpoint for a source location.
         */
        constructor(location: Location, enabled?: boolean, condition?: string, hitCondition?: string, logMessage?: string);
    }

    /**
     * A breakpoint specified by a function name.
     */
    export class FunctionBreakpoint extends Breakpoint {
        /**
         * The name of the function to which this breakpoint is attached.
         */
        readonly functionName: string;

        /**
         * Create a new function breakpoint.
         */
        constructor(functionName: string, enabled?: boolean, condition?: string, hitCondition?: string, logMessage?: string);
    }

    /**
     * Namespace for debug functionality.
     */
    export namespace debug {

        /**
         * The currently active [debug session](#DebugSession) or `undefined`. The active debug session is the one
         * represented by the debug action floating window or the one currently shown in the drop down menu of the debug action floating window.
         * If no debug session is active, the value is `undefined`.
         */
        export let activeDebugSession: DebugSession | undefined;

        /**
         * The currently active [debug console](#DebugConsole).
         */
        export let activeDebugConsole: DebugConsole;

        /**
         * List of breakpoints.
         */
        export let breakpoints: Breakpoint[];

        /**
         * An [event](#Event) which fires when the [active debug session](#debug.activeDebugSession)
         * has changed. *Note* that the event also fires when the active debug session changes
         * to `undefined`.
         */
        export const onDidChangeActiveDebugSession: Event<DebugSession | undefined>;

        /**
         * An [event](#Event) which fires when a new [debug session](#DebugSession) has been started.
         */
        export const onDidStartDebugSession: Event<DebugSession>;

        /**
         * An [event](#Event) which fires when a custom DAP event is received from the [debug session](#DebugSession).
         */
        export const onDidReceiveDebugSessionCustomEvent: Event<DebugSessionCustomEvent>;

        /**
         * An [event](#Event) which fires when a [debug session](#DebugSession) has terminated.
         */
        export const onDidTerminateDebugSession: Event<DebugSession>;

        /**
         * An [event](#Event) that is emitted when the set of breakpoints is added, removed, or changed.
         */
        export const onDidChangeBreakpoints: Event<BreakpointsChangeEvent>;

        /**
         * Register a [debug adapter descriptor factory](#DebugAdapterDescriptorFactory) for a specific debug type.
         * An extension is only allowed to register a DebugAdapterDescriptorFactory for the debug type(s) defined by the extension. Otherwise an error is thrown.
         * Registering more than one DebugAdapterDescriptorFactory for a debug type results in an error.
         *
         * @param debugType The debug type for which the factory is registered.
         * @param factory The [debug adapter descriptor factory](#DebugAdapterDescriptorFactory) to register.
         * @return A [disposable](#Disposable) that unregisters this factory when being disposed.
         */
        export function registerDebugAdapterDescriptorFactory(debugType: string, factory: DebugAdapterDescriptorFactory): Disposable;

        /**
         * Register a [debug configuration provider](#DebugConfigurationProvider) for a specific debug type.
         * More than one provider can be registered for the same type.
         *
         * @param type The debug type for which the provider is registered.
         * @param provider The [debug configuration provider](#DebugConfigurationProvider) to register.
         * @return A [disposable](#Disposable) that unregisters this provider when being disposed.
         */
        export function registerDebugConfigurationProvider(debugType: string, provider: DebugConfigurationProvider): Disposable;

        /**
         * Register a debug adapter tracker factory for the given debug type.
         *
         * @param debugType The debug type for which the factory is registered or '*' for matching all debug types.
         * @param factory The [debug adapter tracker factory](#DebugAdapterTrackerFactory) to register.
         * @return A [disposable](#Disposable) that unregisters this factory when being disposed.
         */
        export function registerDebugAdapterTrackerFactory(debugType: string, factory: DebugAdapterTrackerFactory): Disposable;

        /**
         * Start debugging by using either a named launch or named compound configuration,
         * or by directly passing a [DebugConfiguration](#DebugConfiguration).
         * The named configurations are looked up in '.vscode/launch.json' found in the given folder.
         * Before debugging starts, all unsaved files are saved and the launch configurations are brought up-to-date.
         * Folder specific variables used in the configuration (e.g. '${workspaceFolder}') are resolved against the given folder.
         * @param folder The [workspace folder](#WorkspaceFolder) for looking up named configurations and resolving variables or `undefined` for a non-folder setup.
         * @param nameOrConfiguration Either the name of a debug or compound configuration or a [DebugConfiguration](#DebugConfiguration) object.
         * @return A thenable that resolves when debugging could be successfully started.
         */
        export function startDebugging(folder: WorkspaceFolder | undefined, nameOrConfiguration: string | DebugConfiguration): PromiseLike<boolean>;

        /**
         * Add breakpoints.
         * @param breakpoints The breakpoints to add.
        */
        export function addBreakpoints(breakpoints: Breakpoint[]): void;

        /**
         * Remove breakpoints.
         * @param breakpoints The breakpoints to remove.
         */
        export function removeBreakpoints(breakpoints: Breakpoint[]): void;
    }

    /**
     * Represents options to configure the behavior of showing a [document](#TextDocument) in an [editor](#TextEditor).
     */
    export interface TextDocumentShowOptions {
        /**
         * An optional view column in which the [editor](#TextEditor) should be shown.
         * The default is the [active](#ViewColumn.Active), other values are adjusted to
         * be `Min(column, columnCount + 1)`, the [active](#ViewColumn.Active)-column is
         * not adjusted. Use [`ViewColumn.Beside`](#ViewColumn.Beside) to open the
         * editor to the side of the currently active one.
         */
        viewColumn?: ViewColumn;

        /**
         * An optional flag that when `true` will stop the [editor](#TextEditor) from taking focus.
         */
        preserveFocus?: boolean;

        /**
         * An optional flag that controls if an [editor](#TextEditor)-tab will be replaced
         * with the next editor or if it will be kept.
         */
        preview?: boolean;

        /**
         * An optional selection to apply for the document in the [editor](#TextEditor).
         */
        selection?: Range;
    }

    export enum ShellQuoting {

        /**
         * Character escaping should be used. This for example
         * uses \ on bash and ` on PowerShell.
         */
        Escape = 1,

        /**
         * Strong string quoting should be used. This for example
         * uses " for Windows cmd and ' for bash and PowerShell.
         * Strong quoting treats arguments as literal strings.
         * Under PowerShell echo 'The value is $(2 * 3)' will
         * print `The value is $(2 * 3)`
         */
        Strong = 2,

        /**
         * Weak string quoting should be used. This for example
         * uses " for Windows cmd, bash and PowerShell. Weak quoting
         * still performs some kind of evaluation inside the quoted
         * string.  Under PowerShell echo "The value is $(2 * 3)"
         * will print `The value is 6`
         */
        Weak = 3
    }

    /** A string that will be quoted depending on the used shell. */
    export interface ShellQuotedString {
        /** The actual string value */
        value: string;

        /** The quoting style to use */
        quoting: ShellQuoting;
    }

    export interface ShellQuotingOptions {

        /**
         * The character used to do character escaping. If a string is provided only spaces
         * are escaped. If a `{ escapeChar, charsToEscape }` literal is provide all characters
         * in `charsToEscape` are escaped using the `escapeChar`.
         */
        escape?: string | {
            /** The escape character */
            escapeChar: string;

            /** The characters to escape */
            charsToEscape: string;
        };

        /** The character used for strong quoting. The string's length must be 1 */
        strong?: string;

        /** The character used for weak quoting. The string's length must be 1 */
        weak?: string;
    }

    export interface ShellExecutionOptions {

        /** The shell executable */
        executable?: string;

        /**
         * The arguments to be passed to the shell executable used to run the task. Most shells
         * require special arguments to execute a command. For  example `bash` requires the `-c`
         * argument to execute a command, `PowerShell` requires `-Command` and `cmd` requires both
         * `/d` and `/c`.
         */
        shellArgs?: string[];

        /** The shell quotes supported by this shell */
        shellQuoting?: ShellQuotingOptions;

        /**
         * The current working directory of the executed shell.
         * If omitted the tools current workspace root is used.
         */
        cwd?: string;

        /**
         * The additional environment of the executed shell. If omitted
         * the parent process' environment is used. If provided it is merged with
         * the parent process' environment.
         */
        env?: { [key: string]: string };
    }

    export class ShellExecution {
        /**
         * Creates a shell execution with a full command line.
         *
         * @param commandLine The command line to execute.
         * @param options Optional options for the started the shell.
         */
        constructor(commandLine: string, options?: ShellExecutionOptions);

        /**
         * Creates a shell execution with a command and arguments. For the real execution VS Code will
         * construct a command line from the command and the arguments. This is subject to interpretation
         * especially when it comes to quoting. If full control over the command line is needed please
         * use the constructor that creates a `ShellExecution` with the full command line.
         *
         * @param command The command to execute.
         * @param args The command arguments.
         * @param options Optional options for the started the shell.
         */
        constructor(command: string | ShellQuotedString, args: (string | ShellQuotedString)[], options?: ShellExecutionOptions);

        /**
         * The shell command line. Is `undefined` if created with a command and arguments.
         */
        commandLine?: string;

        /**
         * The shell options used when the command line is executed in a shell.
         * Defaults to undefined.
         */
        options?: ShellExecutionOptions;

        /**
         * The shell command. Is `undefined` if created with a full command line.
         */
        command?: string | ShellQuotedString;

        /**
         * The shell args. Is `undefined` if created with a full command line.
         */
        args?: (string | ShellQuotedString)[];
    }

    export interface ProcessExecutionOptions {
        /**
         * The current working directory of the executed program or shell.
         * If omitted the tools current workspace root is used.
         */
        cwd?: string;

        /**
         * The additional environment of the executed program or shell. If omitted
         * the parent process' environment is used. If provided it is merged with
         * the parent process' environment.
         */
        env?: { [key: string]: string };
    }

    export class ProcessExecution {

        /**
         * Creates a process execution.
         *
         * @param process The process to start.
         * @param options Optional options for the started process.
         */
        constructor(process: string, options?: ProcessExecutionOptions);

        /**
         * Creates a process execution.
         *
         * @param process The process to start.
         * @param args Arguments to be passed to the process.
         * @param options Optional options for the started process.
         */
        constructor(process: string, args: string[], options?: ProcessExecutionOptions);

        /** The process to be executed. */
        process: string;

        /** The arguments passed to the process. Defaults to an empty array. */
        args: string[];

        /**
         * The process options used when the process is executed.
         * Defaults to undefined.
         */
        options?: ProcessExecutionOptions;
    }

    export interface TaskDefinition {
        /**
         * The task definition describing the task provided by an extension.
         * Usually a task provider defines more properties to identify
         * a task. They need to be defined in the package.json of the
         * extension under the 'taskDefinitions' extension point. The npm
         * task definition for example looks like this
         * ```typescript
         * interface NpmTaskDefinition extends TaskDefinition {
         *     script: string;
         * }
         * ```
         *
         * Note that type identifier starting with a '$' are reserved for internal
         * usages and shouldn't be used by extensions.
         */
        readonly type: string;

        /** Additional attributes of a concrete task definition. */
        [name: string]: any;
    }

    export enum TaskScope {
        /** The task is a global task */
        Global = 1,

        /** The task is a workspace task */
        Workspace = 2
    }

    export class TaskGroup {

        /** The clean task group */
        static Clean: TaskGroup;

        /** The build task group */
        static Build: TaskGroup;

        /** The rebuild all task group */
        static Rebuild: TaskGroup;

        /** The test all task group */
        static Test: TaskGroup;

        private constructor(id: string, label: string);
    }

    /** Controls the behaviour of the terminal's visibility. */
    export enum TaskRevealKind {
        /** Always brings the terminal to front if the task is executed. */
        Always = 1,

        /**
         * Only brings the terminal to front if a problem is detected executing the task
         * (e.g. the task couldn't be started because).
         */
        Silent = 2,

        /** The terminal never comes to front when the task is executed. */
        Never = 3
    }

    /** Controls how the task channel is used between tasks */
    export enum TaskPanelKind {

        /** Shares a panel with other tasks. This is the default. */
        Shared = 1,

        /**
         * Uses a dedicated panel for this tasks. The panel is not
         * shared with other tasks.
         */
        Dedicated = 2,

        /** Creates a new panel whenever this task is executed. */
        New = 3
    }

    export interface TaskPresentationOptions {
        /**
         * Controls whether the task output is reveal in the user interface.
         * Defaults to `RevealKind.Always`.
         */
        reveal?: TaskRevealKind;

        /**
         * Controls whether the command associated with the task is echoed
         * in the user interface.
         */
        echo?: boolean;

        /** Controls whether the panel showing the task output is taking focus. */
        focus?: boolean;

        /**
         * Controls if the task panel is used for this task only (dedicated),
         * shared between tasks (shared) or if a new panel is created on
         * every task execution (new). Defaults to `TaskInstanceKind.Shared`
         */
        panel?: TaskPanelKind;

        /** Controls whether to show the "Terminal will be reused by tasks, press any key to close it" message. */
        showReuseMessage?: boolean;
    }

    export class Task {

        /**
         * Creates a new task.
         *
         * @param definition The task definition.
         * @param scope Specifies the task's scope.
         * @param name The task's name. Is presented in the user interface.
         * @param source The task's source (e.g. 'gulp', 'npm', ...). Is presented in the user interface.
         * @param execution The process or shell execution.
         * @param problemMatchers the names of problem matchers to use, like '$tsc'
         *  or '$eslint'. Problem matchers can be contributed by an extension using
         *  the `problemMatchers` extension point.
         */
        constructor(
            taskDefinition: TaskDefinition,
            scope: WorkspaceFolder | TaskScope.Global | TaskScope.Workspace,
            name: string,
            source?: string,
            execution?: ProcessExecution | ShellExecution,
            problemMatchers?: string | string[]);

        /**
         * ~~Creates a new task.~~
         *
         * @deprecated Use the new constructors that allow specifying a scope for the task.
         *
         * @param definition The task definition as defined in the taskDefinitions extension point.
         * @param name The task's name. Is presented in the user interface.
         * @param source The task's source (e.g. 'gulp', 'npm', ...). Is presented in the user interface.
         * @param execution The process or shell execution.
         * @param problemMatchers the names of problem matchers to use, like '$tsc'
         *  or '$eslint'. Problem matchers can be contributed by an extension using
         *  the `problemMatchers` extension point.
         */
        constructor(
            taskDefinition: TaskDefinition,
            name: string,
            source: string,
            execution?: ProcessExecution | ShellExecution,
            problemMatchers?: string | string[]);

        /** The task's name */
        name: string;

        /** The task's definition. */
        definition: TaskDefinition;

        /** The task's scope. */
        scope?: TaskScope.Global | TaskScope.Workspace | WorkspaceFolder;

        /** The task's execution engine */
        execution?: ProcessExecution | ShellExecution;

        /** Whether the task is a background task or not. */
        isBackground?: boolean;

        /**
         * A human-readable string describing the source of this
         * shell task, e.g. 'gulp' or 'npm'.
         */
        source?: string;

        /**
         * The task group this tasks belongs to. See TaskGroup
         * for a predefined set of available groups.
         * Defaults to undefined meaning that the task doesn't
         * belong to any special group.
         */
        group?: TaskGroup;

        /** The presentation options. Defaults to an empty literal. */
        presentationOptions?: TaskPresentationOptions;

        /**
         * The problem matchers attached to the task. Defaults to an empty
         * array.
         */
        problemMatchers?: string[];
    }

    export interface TaskProvider {
        /**
         * Provides tasks.
         * @param token A cancellation token.
         * @return an array of tasks
         */
        provideTasks(token?: CancellationToken): ProviderResult<Task[]>;

        /**
         * Resolves a task that has no [`execution`](#Task.execution) set. Tasks are
         * often created from information found in the `tasks.json`-file. Such tasks miss
         * the information on how to execute them and a task provider must fill in
         * the missing information in the `resolveTask`-method.
         *
         * @param task The task to resolve.
         * @param token A cancellation token.
         * @return The resolved task
         */
        resolveTask(task: Task, token?: CancellationToken): ProviderResult<Task>;
    }

    /**
     * An object representing an executed Task. It can be used
     * to terminate a task.
     *
     * This interface is not intended to be implemented.
     */
    export interface TaskExecution {
        /**
         * The task that got started.
         */
        task: Task;

        /**
         * Terminates the task execution.
         */
        terminate(): void;
    }

    /**
     * An event signaling the start of a task execution.
     *
     * This interface is not intended to be implemented.
     */
    interface TaskStartEvent {
        /**
         * The task item representing the task that got started.
         */
        execution: TaskExecution;
    }

    /**
     * An event signaling the end of an executed task.
     *
     * This interface is not intended to be implemented.
     */
    interface TaskEndEvent {
        /**
         * The task item representing the task that finished.
         */
        execution: TaskExecution;
    }

    /**
     * An event signaling the start of a process execution
     * triggered through a task
     */
    export interface TaskProcessStartEvent {
        /**
         * The task execution for which the process got started.
         */
        execution: TaskExecution;

        /**
         * The underlying process id.
         */
        processId: number;
    }

    /**
     * An event signaling the end of a process execution
     * triggered through a task
     */
    export interface TaskProcessEndEvent {

        /**
         * The task execution for which the process got started.
         */
        execution: TaskExecution;

        /**
         * The process's exit code.
         */
        exitCode: number;
    }

    export namespace tasks {

        /**
         * Register a task provider.
         *
         * @param type The task kind type this provider is registered for.
         * @param provider A task provider.
         * @return A [disposable](#Disposable) that unregisters this provider when being disposed.
         */
        export function registerTaskProvider(type: string, provider: TaskProvider): Disposable;

        /**
         * The currently active task executions or an empty array.
         */
        export const taskExecutions: ReadonlyArray<TaskExecution>;

        /** Fires when a task starts. */
        export const onDidStartTask: Event<TaskStartEvent>;

        /** Fires when a task ends. */
        export const onDidEndTask: Event<TaskEndEvent>;

        /**
         * Fires when the underlying process has been started.
         * This event will not fire for tasks that don't
         * execute an underlying process.
         */
        export const onDidStartTaskProcess: Event<TaskProcessStartEvent>;

        /**
         * Fires when the underlying process has ended.
         * This event will not fire for tasks that don't
         * execute an underlying process.
         */
        export const onDidEndTaskProcess: Event<TaskProcessEndEvent>;
    }

    /**
     * A memento represents a storage utility. It can store and retrieve
     * values.
     */
    export interface Memento {

        /**
         * Return a value.
         *
         * @param key A string.
         * @return The stored value or `undefined`.
         */
        get<T>(key: string): T | undefined;

        /**
         * Return a value.
         *
         * @param key A string.
         * @param defaultValue A value that should be returned when there is no
         * value (`undefined`) with the given key.
         * @return The stored value or the defaultValue.
         */
        get<T>(key: string, defaultValue: T): T;

        /**
         * Store a value. The value must be JSON-stringifyable.
         *
         * @param key A string.
         * @param value A value. MUST not contain cyclic references.
         */
        update(key: string, value: any): PromiseLike<void>;
    }

    /* The workspace symbol provider interface defines the contract between extensions
    * and the [symbol search](https://code.visualstudio.com/docs/editor/intellisense)-feature.
    */
    export interface WorkspaceSymbolProvider {

        /**
         * Project-wide search for a symbol matching the given query string.
         *
         * The query-parameter should be interpreted in a relaxed way as the editor will apply its own
         * highlighting and scoring on the results. A good rule of thumb is to match case-insensitive and to
         * simply check that the characters of query appear in their order in a candidate symbol. Don't use
         * prefix, substring, or similar strict matching.
         *
         * To improve performance implementors can implement resolveWorkspaceSymbol and then provide
         * symbols with partial location-objects, without a range defined. The editor will then call
         * resolveWorkspaceSymbol for selected symbols only, e.g. when opening a workspace symbol.
         *
         * @param query A non-empty query string.
         * @param token A cancellation token.
         * @return An array of document highlights or a thenable that
         * resolves to such. The lack of a result can be signaled by
         * returning undefined, null, or an empty array.
         */
        provideWorkspaceSymbols(query: string, token: CancellationToken | undefined): ProviderResult<SymbolInformation[]>;

        /**
         * Given a symbol fill in its [location](#SymbolInformation.location). This method is called whenever a symbol
         * is selected in the UI. Providers can implement this method and return incomplete symbols from
         * [`provideWorkspaceSymbols`](#WorkspaceSymbolProvider.provideWorkspaceSymbols) which often helps to improve
         * performance.
         *
         * @param symbol The symbol that is to be resolved. Guaranteed to be an instance of an object returned from an
         * earlier call to `provideWorkspaceSymbols`.
         * @param token A cancellation token.
         * @return The resolved symbol or a thenable that resolves to that. When no result is returned,
         * the given `symbol` is used.
         */
        resolveWorkspaceSymbol?(symbol: SymbolInformation, token: CancellationToken | undefined): ProviderResult<SymbolInformation>;
    }
}
