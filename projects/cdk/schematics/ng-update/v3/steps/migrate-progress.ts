import {
    createProject,
    DevkitFileSystem,
    saveActiveProject,
    setActiveProject,
} from 'ng-morph';
import {Element} from 'parse5';

import {ALL_FILES, ALL_TS_FILES} from '../../../constants';
import {TuiSchema} from '../../../ng-add/schema';
import {
    infoLog,
    REPLACE_SYMBOL,
    SMALL_TAB_SYMBOL,
    SUCCESS_SYMBOL,
    successLog,
} from '../../../utils/colored-log';
import {projectRoot} from '../../../utils/project-root';
import {findElementsWithAttribute} from '../../../utils/templates/elements';
import {getComponentTemplates} from '../../../utils/templates/get-component-templates';
import {
    getPathFromTemplateResource,
    getTemplateFromTemplateResource,
    getTemplateOffset,
} from '../../../utils/templates/template-resource';
import {TemplateResource} from '../../interfaces/template-resource';

export const DEPRECATED_PROGRESS_PIPES_REG =
    // eslint-disable-next-line unicorn/no-unsafe-regex
    /\s*\|\s*tuiProgressColorSegments(Async\s*\|\s*async)?/gi;

const PROPERTY_FOR_DEPRECATED_PIPES = `[color]`;

export function migrateProgress(fileSystem: DevkitFileSystem, options: TuiSchema): void {
    !options[`skip-logs`] &&
        infoLog(`${SMALL_TAB_SYMBOL}${REPLACE_SYMBOL} migrating progress bars...`);

    const templateResources = getComponentTemplates(ALL_TS_FILES);

    for (const templateResource of templateResources) {
        replaceProgressColorSegmentsPipe(templateResource, fileSystem);
    }

    fileSystem.commitEdits();
    saveActiveProject();
    setActiveProject(createProject(fileSystem.tree, projectRoot(), ALL_FILES));

    !options[`skip-logs`] &&
        successLog(`${SMALL_TAB_SYMBOL}${SUCCESS_SYMBOL} progress bars migrated \n`);
}

function replaceProgressColorSegmentsPipe(
    templateResource: TemplateResource,
    fileSystem: DevkitFileSystem,
): void {
    const template = getTemplateFromTemplateResource(templateResource, fileSystem);
    const templateOffset = getTemplateOffset(templateResource);
    const path = fileSystem.resolve(getPathFromTemplateResource(templateResource));
    const recorder = fileSystem.edit(path);

    const progressElements = findElementsWithAttribute(
        template,
        PROPERTY_FOR_DEPRECATED_PIPES,
    ).filter(isProgressWithDeprecatedPipe);

    for (const progressEl of progressElements) {
        const oldValue =
            progressEl.attrs.find(attr => attr.name === PROPERTY_FOR_DEPRECATED_PIPES)
                ?.value || ``;
        const newValue = oldValue.replace(DEPRECATED_PROGRESS_PIPES_REG, ``);

        const attrLocations = progressEl.sourceCodeLocation?.attrs;

        if (attrLocations) {
            const {startOffset, endOffset} = attrLocations[PROPERTY_FOR_DEPRECATED_PIPES];

            recorder.remove(templateOffset + startOffset, endOffset - startOffset);
            recorder.insertRight(
                templateOffset + startOffset,
                `[tuiProgressColorSegments]="${newValue}"`,
            );
        }
    }
}

function isProgressWithDeprecatedPipe(element: Element): boolean {
    return (
        element.tagName === `progress` &&
        element.attrs.some(
            attr =>
                attr.name === PROPERTY_FOR_DEPRECATED_PIPES &&
                attr.value.match(DEPRECATED_PROGRESS_PIPES_REG),
        )
    );
}
