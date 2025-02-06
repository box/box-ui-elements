import React from 'react';

import './ItemBadge.scss'

const ItemBadge = ({
    isLocked = false
}) => {
    return (
        isLocked && <div className='item-badges'>
            <button className="btn-plain item-badge" type="submit" aria-label="ロック済み" data-resin-target="lockbadge" tabIndex="0">
                <svg width="14" height="14" viewBox="0 0 16 16" focusable="false" aria-hidden="true" role="presentation"><path fill="#222" fillRule="evenodd" d="M8 1a4.48 4.48 0 014.49 4.198A2.471 2.471 0 0114 7.5v4c0 1.4-1.1 2.5-2.5 2.5h-7C3.1 14 2 12.9 2 11.5v-4c0-1.047.615-1.926 1.51-2.303A4.479 4.479 0 018 1zm3.5 5h-7l-.14.007C3.62 6.083 3 6.747 3 7.5v4c0 .8.7 1.5 1.5 1.5h7c.8 0 1.5-.7 1.5-1.5v-4c0-.8-.7-1.5-1.5-1.5zm-2 3c.3 0 .5.2.5.5s-.3.5-.5.5h-3c-.3 0-.5-.2-.5-.5s.2-.5.5-.5h3zM8 2l-.189.005C6.163 2.098 4.778 3.39 4.537 5h6.926C11.213 3.327 9.73 2 8 2z"></path></svg>
            </button>
        </div>
    )
}

export default ItemBadge;