// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import TemplateDropdown from './TemplateDropdown';
import messages from './messages';
import type { Editor, Template } from './flowTypes';
import isHidden from './metadataUtil';
import './Header.scss';

type Props = {
    canAdd: boolean,
    editors: Array<Editor>,
    isDropdownBusy?: boolean,
    onAdd?: (template: Template) => void,
    templates: Array<Template>,
    title?: React.Node,
};

const Header = ({ canAdd, editors, isDropdownBusy, onAdd, templates, title }: Props) => (
    <div className="metadata-instance-editor-header">
        {title || (
            <h4 className="metadata-instance-editor-title">
                <FormattedMessage {...messages.metadataTemplatesTitle} />
            </h4>
        )}
        {canAdd && onAdd && (
            <TemplateDropdown
                isDropdownBusy={isDropdownBusy}
                onAdd={onAdd}
                templates={templates.filter(
                    (template: Template) => !isHidden(template), // Checking both isHidden and hidden attributes due to differences in V2 and V3 APIs
                )}
                usedTemplates={editors.map((editor: Editor) => editor.template)}
            />
        )}
    </div>
);

export default Header;
