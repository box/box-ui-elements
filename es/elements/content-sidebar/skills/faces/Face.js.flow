/**
 * @flow
 * @file File Keywords SkillCard component
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import PlainButton from '../../../../components/plain-button/PlainButton';
import IconClose from '../../../../icons/general/IconClose';
import IconMinus from '../../../../icons/general/IconMinus';
import { SKILLS_TARGETS } from '../../../common/interactionTargets';
import { COLOR_999, COLOR_WHITE } from '../../../../constants';
import type { SkillCardEntry } from '../../../../common/types/skills';

import './Face.scss';

type Props = {
    face: SkillCardEntry,
    isEditing: boolean,
    onDelete: Function,
    onSelect: Function,
    selected?: SkillCardEntry,
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
                className="be-face"
                data-resin-target={SKILLS_TARGETS.FACES.FACE}
                onClick={() => !isEditing && onSelect(face)}
                type="button"
            >
                <img alt={face.text} src={face.image_url} title={face.text} />
                {isFaceSelected && <IconMinus color={COLOR_WHITE} />}
            </PlainButton>
            {isEditing && (
                <PlainButton
                    className="be-face-delete"
                    data-resin-target={SKILLS_TARGETS.FACES.DELETE}
                    onClick={() => onDelete(face)}
                    type="button"
                >
                    <IconClose color={COLOR_999} height={16} width={16} />
                </PlainButton>
            )}
        </div>
    );
};

export default Face;
