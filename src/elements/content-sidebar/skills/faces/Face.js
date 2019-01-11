/**
 * @flow
 * @file File Keywords SkillCard component
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import PlainButton from 'box-react-ui/lib/components/plain-button/PlainButton';
import IconClose from 'box-react-ui/lib/icons/general/IconClose';
import IconMinus from 'box-react-ui/lib/icons/general/IconMinus';
import { COLOR_999, COLOR_WHITE } from '../../../../constants';
import { SKILLS_TARGETS } from '../../../common/interactionTargets';

import './Face.scss';

type Props = {
    face: SkillCardEntry,
    selected?: SkillCardEntry,
    isEditing: boolean,
    onDelete: Function,
    onSelect: Function,
};

const Face = ({ face, selected, isEditing, onDelete, onSelect }: Props) => {
    const isAnyFaceSelected = !!selected;
    const isCurrentFaceSelected = face === selected;
    const isFaceSelected = isAnyFaceSelected && isCurrentFaceSelected && !isEditing;
    const faceClassName = classNames('be-face-wrapper', {
        'be-face-unselected': !isEditing && isAnyFaceSelected && !isCurrentFaceSelected,
    });

    return (
        <div className={faceClassName}>
            <PlainButton
                type="button"
                className="be-face"
                data-resin-target={SKILLS_TARGETS.FACES.FACE}
                onClick={() => !isEditing && onSelect(face)}
            >
                <img alt={face.text} title={face.text} src={face.image_url} />
                {isFaceSelected && <IconMinus color={COLOR_WHITE} />}
            </PlainButton>
            {isEditing && (
                <PlainButton
                    type="button"
                    className="be-face-delete"
                    data-resin-target={SKILLS_TARGETS.FACES.DELETE}
                    onClick={() => onDelete(face)}
                >
                    <IconClose color={COLOR_999} width={16} height={16} />
                </PlainButton>
            )}
        </div>
    );
};

export default Face;
