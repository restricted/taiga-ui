import {InjectionToken} from '@angular/core';
import {PolymorpheusContent} from '@tinkoff/ng-polymorpheus';

import {TUI_DEFAULT_TREE_CONTROLLER, TUI_TREE_ITEM_CONTENT} from './tree.constants';
import type {
    TuiTreeAccessor,
    TuiTreeController,
    TuiTreeItemContext,
    TuiTreeLoader,
} from './tree.interfaces';

/**
 * Controller for tracking value - TuiTreeItemComponent pairs
 */
export const TUI_TREE_ACCESSOR = new InjectionToken<TuiTreeAccessor<unknown>>(
    `[TUI_TREE_ACCESSOR]`,
);

/**
 * Controller for expanding the tree
 */
export const TUI_TREE_CONTROLLER = new InjectionToken<TuiTreeController>(
    `[TUI_TREE_CONTROLLER]`,
    {
        factory: () => TUI_DEFAULT_TREE_CONTROLLER,
    },
);

/**
 * A node of a tree view
 */
export const TUI_TREE_NODE = new InjectionToken(`[TUI_TREE_NODE]`);

/**
 * A tree node placeholder for loading
 */
export const TUI_TREE_LOADING = new InjectionToken(`[TUI_TREE_LOADING]`, {
    factory: () => ({}),
});

/**
 * A tree node starting point
 */
export const TUI_TREE_START = new InjectionToken(`[TUI_TREE_START]`);

/**
 * A service to load tree progressively
 */
export const TUI_TREE_LOADER = new InjectionToken<TuiTreeLoader<unknown>>(
    `[TUI_TREE_LOADER]`,
);

/**
 * Content for a tree item
 */
export const TUI_TREE_CONTENT = new InjectionToken<
    PolymorpheusContent<TuiTreeItemContext>
>(`[TUI_TREE_CONTENT]`, {
    factory: () => TUI_TREE_ITEM_CONTENT,
});

/**
 * Nesting level of current TreeView node
 */
export const TUI_TREE_LEVEL = new InjectionToken<number>(`[TUI_TREE_LEVEL]`, {
    factory: () => -1,
});
