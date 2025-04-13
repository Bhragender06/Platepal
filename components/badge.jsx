import React from 'react';

const Badge = ({ type, text }) => {
    const getBadgeClass = () => {
        switch (type.toLowerCase()) {
            case 'veg':
                return 'badge-veg';
            case 'non-veg':
                return 'badge-non-veg';
            case 'healthy':
                return 'badge-healthy';
            case 'fast-food':
                return 'badge-fast-food';
            default:
                return 'badge-default';
        }
    };

    return (
        <span className={`food-type-badge ${getBadgeClass()}`}>
            {text || type}
        </span>
    );
};

// Default props
Badge.defaultProps = {
    type: 'default',
    text: ''
};

export default Badge;

// Usage example:
// <Badge type="veg" text="Vegetarian" />
// <Badge type="non-veg" text="Non-Vegetarian" />
// <Badge type="healthy" text="Healthy" />
// <Badge type="fast-food" text="Fast Food" />
