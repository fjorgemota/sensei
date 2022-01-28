/**
 * WordPress dependencies
 */
import {
	registerBlockType,
	updateCategory,
	getBlockType,
} from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import SenseiIcon from '../icons/sensei.svg';

/**
 * Register Sensei blocks.
 *
 * @param {Array} blocks Blocks to be registered.
 */
const registerSenseiBlocks = ( blocks ) => {
	updateCategory( 'sensei-lms', {
		icon: <SenseiIcon width="20" height="20" />,
	} );

	blocks.forEach( ( block ) => {
		const { name, ...settings } = block;

		if ( ! getBlockType( name ) ) {
			registerBlockType( name, settings );
		}
	} );
};

export default registerSenseiBlocks;
