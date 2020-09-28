import { registerBlockType } from '@wordpress/blocks';
import CourseOutlineBlock from './course-block';
import './module-block';
import './lesson-block';
import './section-blocks';
import './store';

[ CourseOutlineBlock ].forEach( ( block ) => {
	const { name, ...settings } = block;
	registerBlockType( name, settings );
} );
