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

// tslint:disable:no-any

import * as theia from '@theia/plugin';
import { CommandRegistryImpl } from './command-registry';
import { Emitter } from '@theia/core/lib/common/event';
import { CancellationTokenSource } from '@theia/core/lib/common/cancellation';
import { QuickOpenExtImpl } from './quick-open';
import {
    MAIN_RPC_CONTEXT,
    Plugin as InternalPlugin,
    PluginManager,
    PluginAPIFactory,
    MainMessageType
} from '../api/plugin-api';
import { RPCProtocol } from '../api/rpc-protocol';
import { MessageRegistryExt } from './message-registry';
import { StatusBarMessageRegistryExt } from './status-bar-message-registry';
import { WindowStateExtImpl } from './window-state';
import { WorkspaceExtImpl } from './workspace';
import { EnvExtImpl } from './env';
import { QueryParameters } from '../common/env';
import {
    ConfigurationTarget,
    Disposable,
    Position,
    Range,
    Selection,
    ViewColumn,
    TextEditorSelectionChangeKind,
    EndOfLine,
    SnippetString,
    ThemeColor,
    ThemeIcon,
    TextEditorRevealType,
    TextEditorLineNumbersStyle,
    DecorationRangeBehavior,
    OverviewRulerLane,
    StatusBarAlignment,
    RelativePattern,
    IndentAction,
    CompletionItem,
    CompletionItemKind,
    CompletionList,
    TextEdit,
    CompletionTriggerKind,
    Diagnostic,
    DiagnosticRelatedInformation,
    DiagnosticSeverity,
    DiagnosticTag,
    Location,
    Progress,
    ProgressOptions,
    ProgressLocation,
    ParameterInformation,
    SignatureInformation,
    SignatureHelp,
    Hover,
    DocumentHighlightKind,
    DocumentHighlight,
    DocumentLink,
    CodeLens,
    CodeActionKind,
    CodeActionTrigger,
    TextDocumentSaveReason,
    CodeAction,
    TreeItem,
    TreeItemCollapsibleState,
    DocumentSymbol,
    WorkspaceEdit,
    SymbolInformation,
    FileType,
    FileChangeType,
    ShellQuoting,
    ShellExecution,
    ProcessExecution,
    TaskScope,
    TaskPanelKind,
    TaskRevealKind,
    TaskGroup,
    Task,
    DebugAdapterExecutable,
    DebugAdapterServer,
    Breakpoint,
    SourceBreakpoint,
    FunctionBreakpoint,
    FoldingRange,
    FoldingRangeKind,
    Color,
    ColorInformation,
    ColorPresentation,
    OperatingSystem,
    WebviewPanelTargetArea,
    FileSystemError
} from './types-impl';
import { SymbolKind } from '../api/model';
import { EditorsAndDocumentsExtImpl } from './editors-and-documents';
import { TextEditorsExtImpl } from './text-editors';
import { DocumentsExtImpl } from './documents';
import Uri from 'vscode-uri';
import { TextEditorCursorStyle } from '../common/editor-options';
import { PreferenceRegistryExtImpl } from './preference-registry';
import { OutputChannelRegistryExt } from './output-channel-registry';
import { TerminalServiceExtImpl } from './terminal-ext';
import { LanguagesExtImpl, score } from './languages';
import { fromDocumentSelector } from './type-converters';
import { DialogsExtImpl } from './dialogs';
import { NotificationExtImpl } from './notification';
import { StatusBarExtImpl } from './statusBar';
import { CancellationToken } from '@theia/core/lib/common/cancellation';
import { MarkdownString } from './markdown-string';
import { TreeViewsExtImpl } from './tree/tree-views';
import { LanguagesContributionExtImpl } from './languages-contribution-ext';
import { ConnectionExtImpl } from './connection-ext';
import { WebviewsExtImpl } from './webviews';
import { TasksExtImpl } from './tasks/tasks';
import { DebugExtImpl } from './node/debug/debug';
import { FileSystemExtImpl } from './file-system';
import { QuickPick, QuickPickItem } from '@theia/plugin';
import { ScmExtImpl } from './scm';
import { DecorationProvider, LineChange } from '@theia/plugin';
import { DecorationsExtImpl } from './decorations';

export function createAPIFactory(
    rpc: RPCProtocol,
    pluginManager: PluginManager,
    envExt: EnvExtImpl,
    debugExt: DebugExtImpl,
    preferenceRegistryExt: PreferenceRegistryExtImpl,
    editorsAndDocumentsExt: EditorsAndDocumentsExtImpl,
    workspaceExt: WorkspaceExtImpl,
    messageRegistryExt: MessageRegistryExt
): PluginAPIFactory {

    const commandRegistry = rpc.set(MAIN_RPC_CONTEXT.COMMAND_REGISTRY_EXT, new CommandRegistryImpl(rpc));
    const quickOpenExt = rpc.set(MAIN_RPC_CONTEXT.QUICK_OPEN_EXT, new QuickOpenExtImpl(rpc));
    const dialogsExt = new DialogsExtImpl(rpc);
    const windowStateExt = rpc.set(MAIN_RPC_CONTEXT.WINDOW_STATE_EXT, new WindowStateExtImpl());
    const notificationExt = rpc.set(MAIN_RPC_CONTEXT.NOTIFICATION_EXT, new NotificationExtImpl(rpc));
    const statusBarExt = new StatusBarExtImpl(rpc);
    const editors = rpc.set(MAIN_RPC_CONTEXT.TEXT_EDITORS_EXT, new TextEditorsExtImpl(rpc, editorsAndDocumentsExt));
    const documents = rpc.set(MAIN_RPC_CONTEXT.DOCUMENTS_EXT, new DocumentsExtImpl(rpc, editorsAndDocumentsExt));
    const statusBarMessageRegistryExt = new StatusBarMessageRegistryExt(rpc);
    const terminalExt = rpc.set(MAIN_RPC_CONTEXT.TERMINAL_EXT, new TerminalServiceExtImpl(rpc));
    const outputChannelRegistryExt = new OutputChannelRegistryExt(rpc);
    const languagesExt = rpc.set(MAIN_RPC_CONTEXT.LANGUAGES_EXT, new LanguagesExtImpl(rpc, documents));
    const treeViewsExt = rpc.set(MAIN_RPC_CONTEXT.TREE_VIEWS_EXT, new TreeViewsExtImpl(rpc, commandRegistry));
    const webviewExt = rpc.set(MAIN_RPC_CONTEXT.WEBVIEWS_EXT, new WebviewsExtImpl(rpc));
    const tasksExt = rpc.set(MAIN_RPC_CONTEXT.TASKS_EXT, new TasksExtImpl(rpc));
    const connectionExt = rpc.set(MAIN_RPC_CONTEXT.CONNECTION_EXT, new ConnectionExtImpl(rpc));
    const languagesContributionExt = rpc.set(MAIN_RPC_CONTEXT.LANGUAGES_CONTRIBUTION_EXT, new LanguagesContributionExtImpl(rpc, connectionExt));
    const fileSystemExt = rpc.set(MAIN_RPC_CONTEXT.FILE_SYSTEM_EXT, new FileSystemExtImpl(rpc));
    const scmExt = rpc.set(MAIN_RPC_CONTEXT.SCM_EXT, new ScmExtImpl(rpc, commandRegistry));
    const decorationsExt = rpc.set(MAIN_RPC_CONTEXT.DECORATIONS_EXT, new DecorationsExtImpl(rpc));
    rpc.set(MAIN_RPC_CONTEXT.DEBUG_EXT, debugExt);

    return function (plugin: InternalPlugin): typeof theia {
        const commands: typeof theia.commands = {
            // tslint:disable-next-line:no-any
            registerCommand(command: theia.CommandDescription, handler?: <T>(...args: any[]) => T | Thenable<T>, thisArg?: any): Disposable {
                return commandRegistry.registerCommand(command, handler, thisArg);
            },
            // tslint:disable-next-line:no-any
            executeCommand<T>(commandId: string, ...args: any[]): PromiseLike<T | undefined> {
                return commandRegistry.executeCommand<T>(commandId, ...args);
            },
            registerTextEditorCommand(command: string, handler: (textEditor: theia.TextEditor, edit: theia.TextEditorEdit, ...arg: any[]) => void, thisArg?: any): Disposable {
                return commandRegistry.registerCommand({ id: command }, (...args: any[]): any => {
                    const activeTextEditor = editors.getActiveEditor();
                    if (!activeTextEditor) {
                        console.warn('Cannot execute ' + command + ' because there is no active text editor.');
                        return undefined;
                    }

                    return activeTextEditor.edit((edit: theia.TextEditorEdit) => {
                        args.unshift(activeTextEditor, edit);
                        handler.apply(thisArg, args);
                    }).then(result => {
                        if (!result) {
                            console.warn('Edits from command ' + command + ' were not applied.');
                        }
                    }, err => {
                        console.warn('An error occurred while running command ' + command, err);
                    });
                });
            },
            // tslint:disable-next-line:no-any
            registerHandler(commandId: string, handler: (...args: any[]) => any, thisArg?: any): Disposable {
                return commandRegistry.registerHandler(commandId, handler, thisArg);
            },
            getKeyBinding(commandId: string): PromiseLike<theia.CommandKeyBinding[] | undefined> {
                return commandRegistry.getKeyBinding(commandId);
            },
            getCommands(filterInternal: boolean = false): PromiseLike<string[]> {
                return commandRegistry.getCommands(filterInternal);
            },
            registerDiffInformationCommand(command: string, callback: (diff: LineChange[], ...args: any[]) => any, thisArg?: any): Disposable {
                // Dummy implementation.
                return new Disposable(() => { });
            }
        };

        const { onDidChangeActiveTerminal, onDidCloseTerminal, onDidOpenTerminal } = terminalExt;
        const showInformationMessage = messageRegistryExt.showMessage.bind(messageRegistryExt, MainMessageType.Info);
        const showWarningMessage = messageRegistryExt.showMessage.bind(messageRegistryExt, MainMessageType.Warning);
        const showErrorMessage = messageRegistryExt.showMessage.bind(messageRegistryExt, MainMessageType.Error);
        const window: typeof theia.window = {
            get activeTerminal() {
                return terminalExt.activeTerminal;
            },
            get activeTextEditor() {
                return editors.getActiveEditor();
            },
            get visibleTextEditors() {
                return editors.getVisibleTextEditors();
            },
            get terminals() {
                return terminalExt.terminals;
            },
            onDidChangeActiveTerminal,
            onDidChangeActiveTextEditor(listener, thisArg?, disposables?) {
                return editors.onDidChangeActiveTextEditor(listener, thisArg, disposables);
            },
            onDidChangeVisibleTextEditors(listener, thisArg?, disposables?) {
                return editors.onDidChangeVisibleTextEditors(listener, thisArg, disposables);
            },
            onDidChangeTextEditorSelection(listener, thisArg?, disposables?) {
                return editors.onDidChangeTextEditorSelection(listener, thisArg, disposables);
            },
            onDidChangeTextEditorOptions(listener, thisArg?, disposables?) {
                return editors.onDidChangeTextEditorOptions(listener, thisArg, disposables);
            },
            onDidChangeTextEditorViewColumn(listener, thisArg?, disposables?) {
                return editors.onDidChangeTextEditorViewColumn(listener, thisArg, disposables);
            },
            onDidChangeTextEditorVisibleRanges(listener, thisArg?, disposables?) {
                return editors.onDidChangeTextEditorVisibleRanges(listener, thisArg, disposables);
            },
            async showTextDocument(documentArg: theia.TextDocument | Uri,
                optionsArg?: theia.TextDocumentShowOptions | theia.ViewColumn,
                preserveFocus?: boolean
            ): Promise<theia.TextEditor> {
                let documentOptions: theia.TextDocumentShowOptions | undefined;
                const uri: Uri = documentArg instanceof Uri ? documentArg : documentArg.uri;
                if (optionsArg) {
                    // tslint:disable-next-line:no-any
                    const optionsAny: any = optionsArg;
                    if (optionsAny.preserveFocus || optionsAny.preview || optionsAny.selection || optionsAny.viewColumn) {
                        documentOptions = optionsArg as theia.TextDocumentShowOptions;
                    }
                }
                if (preserveFocus) {
                    if (documentOptions) {
                        documentOptions.preserveFocus = preserveFocus;
                    } else {
                        documentOptions = { preserveFocus };
                    }
                }
                await documents.showDocument(uri, documentOptions);
                const textEditor = editors.getVisibleTextEditors().find(editor => editor.document.uri.toString() === uri.toString());
                if (textEditor) {
                    return Promise.resolve(textEditor);
                } else {
                    throw new Error(`Failed to show text document ${documentArg.toString()}`);
                }
            },
            // tslint:disable-next-line:no-any
            showQuickPick(items: any, options: theia.QuickPickOptions, token?: theia.CancellationToken): any {
                if (token) {
                    const coreEvent = Object.assign(token.onCancellationRequested, { maxListeners: 0 });
                    const coreCancellationToken = { isCancellationRequested: token.isCancellationRequested, onCancellationRequested: coreEvent };
                    return quickOpenExt.showQuickPick(items, options, coreCancellationToken);
                } else {
                    return quickOpenExt.showQuickPick(items, options);
                }
            },
            createQuickPick<T extends QuickPickItem>(): QuickPick<T> {
                return quickOpenExt.createQuickPick();
            },
            showWorkspaceFolderPick(options?: theia.WorkspaceFolderPickOptions): PromiseLike<theia.WorkspaceFolder | undefined> {
                return workspaceExt.pickWorkspaceFolder(options);
            },
            showInformationMessage,
            showWarningMessage,
            showErrorMessage,
            showOpenDialog(options: theia.OpenDialogOptions): PromiseLike<Uri[] | undefined> {
                return dialogsExt.showOpenDialog(options);
            },
            showSaveDialog(options: theia.SaveDialogOptions): PromiseLike<Uri | undefined> {
                return dialogsExt.showSaveDialog(options);
            },
            // tslint:disable-next-line:no-any
            setStatusBarMessage(text: string, arg?: number | PromiseLike<any>): Disposable {
                return statusBarMessageRegistryExt.setStatusBarMessage(text, arg);
            },
            showInputBox(options?: theia.InputBoxOptions, token?: theia.CancellationToken) {
                if (token) {
                    const coreEvent = Object.assign(token.onCancellationRequested, { maxListeners: 0 });
                    const coreCancellationToken = { isCancellationRequested: token.isCancellationRequested, onCancellationRequested: coreEvent };
                    return quickOpenExt.showInput(options, coreCancellationToken);
                } else {
                    return quickOpenExt.showInput(options);
                }
            },
            createStatusBarItem(alignment?: theia.StatusBarAlignment, priority?: number): theia.StatusBarItem {
                return statusBarMessageRegistryExt.createStatusBarItem(alignment, priority);
            },
            createOutputChannel(name: string): theia.OutputChannel {
                return outputChannelRegistryExt.createOutputChannel(name);
            },
            createWebviewPanel(viewType: string,
                title: string,
                showOptions: theia.ViewColumn | theia.WebviewPanelShowOptions,
                options: theia.WebviewPanelOptions & theia.WebviewOptions): theia.WebviewPanel {
                return webviewExt.createWebview(viewType, title, showOptions, options, Uri.file(plugin.pluginPath));
            },
            registerWebviewPanelSerializer(viewType: string, serializer: theia.WebviewPanelSerializer): theia.Disposable {
                return webviewExt.registerWebviewPanelSerializer(viewType, serializer);
            },
            get state(): theia.WindowState {
                return windowStateExt.getWindowState();
            },
            onDidChangeWindowState(listener, thisArg?, disposables?): theia.Disposable {
                return windowStateExt.onDidChangeWindowState(listener, thisArg, disposables);
            },
            createTerminal(nameOrOptions: theia.TerminalOptions | (string | undefined), shellPath?: string, shellArgs?: string[]): theia.Terminal {
                return terminalExt.createTerminal(nameOrOptions, shellPath, shellArgs);
            },
            onDidCloseTerminal,
            onDidOpenTerminal,
            createTextEditorDecorationType(options: theia.DecorationRenderOptions): theia.TextEditorDecorationType {
                return editors.createTextEditorDecorationType(options);
            },
            registerTreeDataProvider<T>(viewId: string, treeDataProvider: theia.TreeDataProvider<T>): Disposable {
                return treeViewsExt.registerTreeDataProvider(plugin, viewId, treeDataProvider);
            },
            createTreeView<T>(viewId: string, options: { treeDataProvider: theia.TreeDataProvider<T> }): theia.TreeView<T> {
                return treeViewsExt.createTreeView(plugin, viewId, options);
            },
            withProgress<R>(
                options: ProgressOptions,
                task: (progress: Progress<{ message?: string; increment?: number }>, token: theia.CancellationToken) => PromiseLike<R>
            ): PromiseLike<R> {
                switch (options.location) {
                    case ProgressLocation.Notification: return notificationExt.withProgress(options, task);
                    case ProgressLocation.Window: return statusBarExt.withProgress(options, task);
                    case ProgressLocation.SourceControl: return new Promise(() => {
                        console.error('Progress location \'SourceControl\' is not supported.');
                    });
                }
            },
            registerDecorationProvider(provider: DecorationProvider): theia.Disposable {
                return decorationsExt.registerDecorationProvider(provider);
            },
            registerUriHandler(handler: theia.UriHandler): theia.Disposable {
                return new Disposable(() => { });
            }
        };

        const workspace: typeof theia.workspace = {
            get rootPath(): string | undefined {
                return workspaceExt.rootPath;
            },
            get workspaceFolders(): theia.WorkspaceFolder[] | undefined {
                return workspaceExt.workspaceFolders;
            },
            get name(): string | undefined {
                return workspaceExt.name;
            },
            onDidChangeWorkspaceFolders(listener, thisArg?, disposables?): theia.Disposable {
                return workspaceExt.onDidChangeWorkspaceFolders(listener, thisArg, disposables);
            },
            get textDocuments() {
                return documents.getAllDocumentData().map(data => data.document);
            },
            onDidChangeTextDocument(listener, thisArg?, disposables?) {
                return documents.onDidChangeDocument(listener, thisArg, disposables);
            },
            onDidCloseTextDocument(listener, thisArg?, disposables?) {
                return documents.onDidRemoveDocument(listener, thisArg, disposables);
            },
            onDidOpenTextDocument(listener, thisArg?, disposables?) {
                return documents.onDidAddDocument(listener, thisArg, disposables);
            },
            onWillSaveTextDocument(listener, thisArg?, disposables?) {
                return documents.onWillSaveTextDocument(listener, thisArg, disposables);
            },
            onDidSaveTextDocument(listener, thisArg?, disposables?) {
                return documents.onDidSaveTextDocument(listener, thisArg, disposables);
            },
            getConfiguration(section?, resource?): theia.WorkspaceConfiguration {
                return preferenceRegistryExt.getConfiguration(section, resource);
            },
            onDidChangeConfiguration(listener, thisArgs?, disposables?): theia.Disposable {
                return preferenceRegistryExt.onDidChangeConfiguration(listener, thisArgs, disposables);
            },
            async openTextDocument(uriOrFileNameOrOptions?: theia.Uri | string | { language?: string; content?: string; }): Promise<theia.TextDocument | undefined> {
                const options = uriOrFileNameOrOptions as { language?: string; content?: string; };

                let uri: Uri;
                if (typeof uriOrFileNameOrOptions === 'string') {
                    uri = Uri.file(uriOrFileNameOrOptions);

                } else if (uriOrFileNameOrOptions instanceof Uri) {
                    uri = uriOrFileNameOrOptions;

                } else if (!options || typeof options === 'object') {
                    uri = await documents.createDocumentData(options);

                } else {
                    return Promise.reject(new Error('illegal argument - uriOrFileNameOrOptions'));
                }

                const data = await documents.openDocument(uri);
                return data && data.document;
            },
            createFileSystemWatcher(globPattern: theia.GlobPattern,
                ignoreCreateEvents?: boolean,
                ignoreChangeEvents?: boolean,
                ignoreDeleteEvents?: boolean): theia.FileSystemWatcher {
                return workspaceExt.createFileSystemWatcher(globPattern, ignoreCreateEvents, ignoreChangeEvents, ignoreDeleteEvents);
            },
            findFiles(include: theia.GlobPattern, exclude?: theia.GlobPattern | null, maxResults?: number, token?: CancellationToken): PromiseLike<Uri[]> {
                return workspaceExt.findFiles(include, exclude, maxResults, token);
            },
            saveAll(includeUntitled?: boolean): PromiseLike<boolean> {
                return editors.saveAll(includeUntitled);
            },
            applyEdit(edit: theia.WorkspaceEdit): PromiseLike<boolean> {
                return editors.applyWorkspaceEdit(edit);
            },
            registerTextDocumentContentProvider(scheme: string, provider: theia.TextDocumentContentProvider): theia.Disposable {
                return workspaceExt.registerTextDocumentContentProvider(scheme, provider);
            },
            registerFileSystemProvider(scheme: string, provider: theia.FileSystemProvider): theia.Disposable {
                return fileSystemExt.registerFileSystemProvider(scheme, provider);
            },
            getWorkspaceFolder(uri: theia.Uri): theia.WorkspaceFolder | undefined {
                return workspaceExt.getWorkspaceFolder(uri);
            },
            asRelativePath(pathOrUri: theia.Uri | string, includeWorkspace?: boolean): string | undefined {
                return workspaceExt.getRelativePath(pathOrUri, includeWorkspace);
            },
            updateWorkspaceFolders: (index, deleteCount, ...workspaceFoldersToAdd) =>
                workspaceExt.updateWorkspaceFolders(index, deleteCount || 0, ...workspaceFoldersToAdd)
            ,
            registerTaskProvider(type: string, provider: theia.TaskProvider): theia.Disposable {
                return tasks.registerTaskProvider(type, provider);
            },
            // Experimental API https://github.com/theia-ide/theia/issues/4167
            onDidRenameFile(listener, thisArg?, disposables?): theia.Disposable {
                return workspaceExt.onDidRenameFile(listener, thisArg, disposables);
            },
            onWillRenameFile(listener, thisArg?, disposables?): theia.Disposable {
                return workspaceExt.onWillRenameFile(listener, thisArg, disposables);
            }
        };

        const env: typeof theia.env = Object.freeze({
            get appName() { return envExt.appName; },
            get appRoot() { return envExt.appRoot; },
            get language() { return envExt.language; },
            get machineId() { return envExt.machineId; },
            get sessionId() { return envExt.sessionId; },
            get uriScheme() { return envExt.uriScheme; },

            getEnvVariable(envVarName: string): PromiseLike<string | undefined> {
                return envExt.getEnvVariable(envVarName);
            },
            getQueryParameter(queryParamName: string): string | string[] | undefined {
                return envExt.getQueryParameter(queryParamName);
            },
            getQueryParameters(): QueryParameters {
                return envExt.getQueryParameters();
            },
            getClientOperatingSystem(): PromiseLike<theia.OperatingSystem> {
                return envExt.getClientOperatingSystem();
            }

        });

        const languageServer: typeof theia.languageServer = {
            registerLanguageServerProvider(languageServerInfo: theia.LanguageServerInfo): Disposable {
                return languagesContributionExt.registerLanguageServerProvider(languageServerInfo);
            },
            stop(id: string): void {
                languagesContributionExt.stop(id);
            }
        };

        const languages: typeof theia.languages = {
            getLanguages(): PromiseLike<string[]> {
                return languagesExt.getLanguages();
            },
            setTextDocumentLanguage(document: theia.TextDocument, languageId: string): PromiseLike<theia.TextDocument> {
                return languagesExt.changeLanguage(document.uri, languageId);
            },
            match(selector: theia.DocumentSelector, document: theia.TextDocument): number {
                return score(fromDocumentSelector(selector), document.uri, document.languageId, true);
            },
            get onDidChangeDiagnostics(): theia.Event<theia.DiagnosticChangeEvent> {
                return languagesExt.onDidChangeDiagnostics;
            },
            getDiagnostics(resource?: Uri) {
                // tslint:disable-next-line:no-any
                return <any>languagesExt.getDiagnostics(resource);
            },
            createDiagnosticCollection(name?: string): theia.DiagnosticCollection {
                return languagesExt.createDiagnosticCollection(name);
            },
            setLanguageConfiguration(language: string, configuration: theia.LanguageConfiguration): theia.Disposable {
                return languagesExt.setLanguageConfiguration(language, configuration);
            },
            registerCompletionItemProvider(selector: theia.DocumentSelector, provider: theia.CompletionItemProvider, ...triggerCharacters: string[]): theia.Disposable {
                return languagesExt.registerCompletionItemProvider(selector, provider, triggerCharacters);
            },
            registerDefinitionProvider(selector: theia.DocumentSelector, provider: theia.DefinitionProvider): theia.Disposable {
                return languagesExt.registerDefinitionProvider(selector, provider);
            },
            registerSignatureHelpProvider(selector: theia.DocumentSelector, provider: theia.SignatureHelpProvider, ...triggerCharacters: string[]): theia.Disposable {
                return languagesExt.registerSignatureHelpProvider(selector, provider, ...triggerCharacters);
            },
            registerTypeDefinitionProvider(selector: theia.DocumentSelector, provider: theia.TypeDefinitionProvider): theia.Disposable {
                return languagesExt.registerTypeDefinitionProvider(selector, provider);
            },
            registerImplementationProvider(selector: theia.DocumentSelector, provider: theia.ImplementationProvider): theia.Disposable {
                return languagesExt.registerImplementationProvider(selector, provider);
            },
            registerHoverProvider(selector: theia.DocumentSelector, provider: theia.HoverProvider): theia.Disposable {
                return languagesExt.registerHoverProvider(selector, provider);
            },
            registerDocumentHighlightProvider(selector: theia.DocumentSelector, provider: theia.DocumentHighlightProvider): theia.Disposable {
                return languagesExt.registerDocumentHighlightProvider(selector, provider);
            },
            registerWorkspaceSymbolProvider(provider: theia.WorkspaceSymbolProvider): theia.Disposable {
                return languagesExt.registerWorkspaceSymbolProvider(provider);
            },
            registerDocumentFormattingEditProvider(selector: theia.DocumentSelector, provider: theia.DocumentFormattingEditProvider): theia.Disposable {
                return languagesExt.registerDocumentFormattingEditProvider(selector, provider);
            },
            registerDocumentRangeFormattingEditProvider(selector: theia.DocumentSelector, provider: theia.DocumentRangeFormattingEditProvider): theia.Disposable {
                return languagesExt.registerDocumentRangeFormattingEditProvider(selector, provider);
            },
            registerOnTypeFormattingEditProvider(
                selector: theia.DocumentSelector,
                provider: theia.OnTypeFormattingEditProvider,
                firstTriggerCharacter: string,
                ...moreTriggerCharacters: string[]
            ): theia.Disposable {
                return languagesExt.registerOnTypeFormattingEditProvider(selector, provider, [firstTriggerCharacter].concat(moreTriggerCharacters));
            },
            registerDocumentLinkProvider(selector: theia.DocumentSelector, provider: theia.DocumentLinkProvider): theia.Disposable {
                return languagesExt.registerLinkProvider(selector, provider);
            },
            registerCodeActionsProvider(selector: theia.DocumentSelector, provider: theia.CodeActionProvider, metadata?: theia.CodeActionProviderMetadata): theia.Disposable {
                return languagesExt.registerCodeActionsProvider(selector, provider, plugin.model, metadata);
            },
            registerCodeLensProvider(selector: theia.DocumentSelector, provider: theia.CodeLensProvider): theia.Disposable {
                return languagesExt.registerCodeLensProvider(selector, provider);
            },
            registerReferenceProvider(selector: theia.DocumentSelector, provider: theia.ReferenceProvider): theia.Disposable {
                return languagesExt.registerReferenceProvider(selector, provider);
            },
            registerDocumentSymbolProvider(selector: theia.DocumentSelector, provider: theia.DocumentSymbolProvider): theia.Disposable {
                return languagesExt.registerDocumentSymbolProvider(selector, provider);
            },
            registerColorProvider(selector: theia.DocumentSelector, provider: theia.DocumentColorProvider): theia.Disposable {
                return languagesExt.registerColorProvider(selector, provider);
            },
            registerFoldingRangeProvider(selector: theia.DocumentSelector, provider: theia.FoldingRangeProvider): theia.Disposable {
                return languagesExt.registerFoldingRangeProvider(selector, provider);
            },
            registerRenameProvider(selector: theia.DocumentSelector, provider: theia.RenameProvider): theia.Disposable {
                return languagesExt.registerRenameProvider(selector, provider);
            },
        };

        const plugins: typeof theia.plugins = {
            // tslint:disable-next-line:no-any
            get all(): theia.Plugin<any>[] {
                return pluginManager.getAllPlugins().map(plg => new Plugin(pluginManager, plg));
            },
            // tslint:disable-next-line:no-any
            getPlugin(pluginId: string): theia.Plugin<any> | undefined {
                const plg = pluginManager.getPluginById(pluginId);
                if (plg) {
                    return new Plugin(pluginManager, plg);
                }
                return undefined;
            }
        };

        const debuggersContributions = plugin.model.contributes && plugin.model.contributes.debuggers || [];
        debugExt.assistedInject(connectionExt, commandRegistry);
        debugExt.registerDebuggersContributions(plugin.pluginFolder, debuggersContributions);
        const debug: typeof theia.debug = {
            get activeDebugSession(): theia.DebugSession | undefined {
                return debugExt.activeDebugSession;
            },
            get activeDebugConsole(): theia.DebugConsole {
                return debugExt.activeDebugConsole;
            },
            get breakpoints(): theia.Breakpoint[] {
                return debugExt.breakpoints;
            },
            get onDidChangeActiveDebugSession(): theia.Event<theia.DebugSession | undefined> {
                return debugExt.onDidChangeActiveDebugSession;
            },
            get onDidStartDebugSession(): theia.Event<theia.DebugSession> {
                return debugExt.onDidStartDebugSession;
            },
            get onDidReceiveDebugSessionCustomEvent(): theia.Event<theia.DebugSessionCustomEvent> {
                return debugExt.onDidReceiveDebugSessionCustomEvent;
            },
            get onDidTerminateDebugSession(): theia.Event<theia.DebugSession> {
                return debugExt.onDidTerminateDebugSession;
            },
            get onDidChangeBreakpoints(): theia.Event<theia.BreakpointsChangeEvent> {
                return debugExt.onDidChangeBreakpoints;
            },
            registerDebugAdapterDescriptorFactory(debugType: string, factory: theia.DebugAdapterDescriptorFactory): Disposable {
                return debugExt.registerDebugAdapterDescriptorFactory(debugType, factory);
            },
            registerDebugConfigurationProvider(debugType: string, provider: theia.DebugConfigurationProvider): Disposable {
                return debugExt.registerDebugConfigurationProvider(debugType, provider);
            },
            registerDebugAdapterTrackerFactory(debugType: string, factory: theia.DebugAdapterTrackerFactory): Disposable {
                return debugExt.registerDebugAdapterTrackerFactory(debugType, factory);
            },
            startDebugging(folder: theia.WorkspaceFolder | undefined, nameOrConfiguration: string | theia.DebugConfiguration): Thenable<boolean> {
                return debugExt.startDebugging(folder, nameOrConfiguration);
            },
            addBreakpoints(breakpoints: theia.Breakpoint[]): void {
                debugExt.addBreakpoints(breakpoints);
            },
            removeBreakpoints(breakpoints: theia.Breakpoint[]): void {
                debugExt.removeBreakpoints(breakpoints);
            }
        };

        const tasks: typeof theia.tasks = {
            registerTaskProvider(type: string, provider: theia.TaskProvider): theia.Disposable {
                return tasksExt.registerTaskProvider(type, provider);
            },

            get taskExecutions(): ReadonlyArray<theia.TaskExecution> {
                return tasksExt.taskExecutions;
            },

            onDidStartTask(listener, thisArg?, disposables?) {
                return tasksExt.onDidStartTask(listener, thisArg, disposables);
            },

            onDidEndTask(listener, thisArg?, disposables?) {
                return tasksExt.onDidEndTask(listener, thisArg, disposables);
            },

            onDidStartTaskProcess(listener, thisArg?, disposables?) {
                return tasksExt.onDidStartTaskProcess(listener, thisArg, disposables);
            },

            onDidEndTaskProcess(listener, thisArg?, disposables?) {
                return tasksExt.onDidEndTaskProcess(listener, thisArg, disposables);
            }
        };

        const scm: typeof theia.scm = {
            get inputBox(): theia.SourceControlInputBox {
                const inputBox = scmExt.getLastInputBox(plugin);
                if (inputBox) {
                    return inputBox;
                } else {
                    throw new Error('Input box not found!');
                }
            },
            createSourceControl(id: string, label: string, rootUri?: Uri): theia.SourceControl {
                return scmExt.createSourceControl(plugin, id, label, rootUri);
            }
        };

        return <typeof theia>{
            version: require('../../package.json').version,
            commands,
            window,
            workspace,
            env,
            languageServer,
            languages,
            plugins,
            debug,
            tasks,
            scm,
            // Types
            StatusBarAlignment: StatusBarAlignment,
            Disposable: Disposable,
            EventEmitter: Emitter,
            CancellationTokenSource: CancellationTokenSource,
            MarkdownString,
            Position: Position,
            Range: Range,
            Selection: Selection,
            ViewColumn: ViewColumn,
            TextEditorSelectionChangeKind: TextEditorSelectionChangeKind,
            Uri: Uri,
            EndOfLine,
            TextEditorRevealType,
            TextEditorCursorStyle,
            TextEditorLineNumbersStyle,
            ThemeColor,
            ThemeIcon,
            SnippetString,
            DecorationRangeBehavior,
            OverviewRulerLane,
            ConfigurationTarget,
            RelativePattern,
            IndentAction,
            CompletionItem,
            CompletionItemKind,
            CompletionList,
            DiagnosticSeverity,
            DiagnosticRelatedInformation,
            Location,
            DiagnosticTag,
            Diagnostic,
            CompletionTriggerKind,
            TextEdit,
            ProgressLocation,
            ProgressOptions,
            Progress,
            ParameterInformation,
            SignatureInformation,
            SignatureHelp,
            Hover,
            DocumentHighlightKind,
            DocumentHighlight,
            DocumentLink,
            CodeLens,
            CodeActionKind,
            CodeActionTrigger,
            TextDocumentSaveReason,
            CodeAction,
            TreeItem,
            TreeItemCollapsibleState,
            SymbolKind,
            DocumentSymbol,
            WorkspaceEdit,
            SymbolInformation,
            FileType,
            FileChangeType,
            ShellQuoting,
            ShellExecution,
            ProcessExecution,
            TaskScope,
            TaskRevealKind,
            TaskPanelKind,
            TaskGroup,
            Task,
            DebugAdapterExecutable,
            DebugAdapterServer,
            Breakpoint,
            SourceBreakpoint,
            FunctionBreakpoint,
            Color,
            ColorInformation,
            ColorPresentation,
            FoldingRange,
            FoldingRangeKind,
            OperatingSystem,
            WebviewPanelTargetArea,
            FileSystemError
        };
    };
}

class Plugin<T> implements theia.Plugin<T> {
    id: string;
    pluginPath: string;
    isActive: boolean;
    // tslint:disable-next-line:no-any
    packageJSON: any;
    pluginType: theia.PluginType;
    constructor(private readonly pluginManager: PluginManager, plugin: InternalPlugin) {
        this.id = plugin.model.id;
        this.pluginPath = plugin.pluginFolder;
        this.packageJSON = plugin.rawModel;
        this.isActive = true;
        this.pluginType = plugin.model.entryPoint.frontend ? 'frontend' : 'backend';
    }

    get exports(): T {
        return <T>this.pluginManager.getPluginExport(this.id);
    }

    activate(): PromiseLike<T> {
        return this.pluginManager.activatePlugin(this.id).then(() => this.exports);
    }
}
