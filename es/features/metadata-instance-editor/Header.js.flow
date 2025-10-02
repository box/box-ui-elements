// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import TemplateDropdown from './TemplateDropdown';
import messages from './messages';
import { isHidden } from './metadataUtil';
import type { MetadataEditor, MetadataTemplate } from '../../common/types/metadata';
import './Header.scss';

type Props = {
    canAdd: boolean,
    editors: Array<MetadataEditor>,
    isDropdownBusy?: boolean,
    onAdd?: (template: MetadataTemplate) => void,
    templates: Array<MetadataTemplate>,
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
                    (template: MetadataTemplate) => !isHidden(template), // Checking both isHidden and hidden attributes due to differences in V2 and V3 APIs
                )}
                usedTemplates={editors.map((editor: MetadataEditor) => editor.template)}
            />
        )}
    </div>
);

export default Header;
