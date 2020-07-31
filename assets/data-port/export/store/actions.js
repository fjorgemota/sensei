import { apiFetch, select } from '@wordpress/data-controls';
import { EXPORT_STORE } from './index';
import {
	clearSchedule,
	schedule,
} from '../../../shared/data/schedule-controls';

const EXPORT_REST_API = '/sensei-internal/v1/export';

/**
 * @typedef Job
 *
 * @property {Object}   status            Job status.
 * @property {string}   status.status     Job status name.
 * @property {number}   status.percentage Job progress percentage.
 * @property {string}   id                Job ID.
 * @property {boolean}  deleted           Was the job deleted.
 * @property {Object}   result            Job result.
 * @property {Object[]} files             Job files.
 * @property {Object}   error             Error message.
 */

/**
 * Set job state.
 *
 * @param {Job} job Job state.
 */
export const setJob = ( job ) => ( { type: 'SET_JOB', job } );

/**
 * Set error.
 *
 * @param {string} error Error message.#
 */
export const setRequestError = ( error ) => ( { type: 'SET_ERROR', error } );

/**
 * Clear job state.
 */
export const clearJob = () => ( { type: 'CLEAR_JOB' } );

/**
 * Start an export.
 *
 * @access public
 * @param {string[]} types Content types.
 */
export const start = function* ( types ) {
	yield setJob( {
		status: 'started',
		percentage: 0,
	} );

	yield createJob();
	yield startJob( types );
};

/**
 * Reset state.
 *
 * @access public
 */
export const reset = function* () {
	yield clearJob();
	yield clearSchedule();
};

/**
 * Request to delete the job.
 *
 * @access public
 */
export const cancel = function* () {
	yield clearSchedule();
	yield sendJobRequest( {
		method: 'DELETE',
	} );
	yield clearJob();
};

/**
 * Update job state from REST API.
 */
export const update = function* () {
	yield sendJobRequest();
};

/**
 * Check if there is an active job and load it.
 */
export const checkForActiveJob = function* () {
	yield sendJobRequest( { jobId: 'active' } );
};

/**
 * Perform REST API request for a job and apply returned job state.
 *
 * @param {Object} options        apiFetch request object.
 * @param {string?} options.path  Request sub-path in exporter API.
 * @param {string?} options.jobId Override job ID
 */
export const sendJobRequest = function* ( options = {} ) {
	let { path, jobId, ...requestOptions } = options;

	if ( ! jobId ) {
		jobId = yield select( EXPORT_STORE, 'getJobId' );
		if ( ! jobId ) {
			yield setRequestError( 'No job ID' );
			return;
		}
	}

	yield sendRequest( { path, jobId, ...requestOptions } );
};

/**
 * Perform REST API request and apply returned job state.
 *
 * @param {Object} options Request object.
 * @param {string} options.path Request sub-path in exporter API.
 * @param {string?} options.jobId Job ID
 */
export const sendRequest = function* ( options = {} ) {
	let { path, jobId, ...requestOptions } = options;

	path = [ EXPORT_REST_API, jobId, path ].filter( ( i ) => !! i ).join( '/' );

	try {
		const job = yield apiFetch( { path, ...requestOptions } );

		yield handleResult( job );
	} catch ( error ) {
		if (
			'active' === jobId &&
			'sensei_data_port_job_not_found' === error.code
		) {
			return yield clearJob();
		}
		yield setRequestError( error.message );
	}
};

/**
 * Request to create a new job.
 */
export const createJob = function* () {
	yield sendRequest( {
		method: 'POST',
	} );
};

/**
 * Request to start job.
 *
 * @param {string[]} types Content types to export.
 */
export const startJob = function* ( types ) {
	yield sendJobRequest( {
		path: 'start',
		method: 'POST',
		data: { content_types: types },
	} );
};

/**
 * Set job state from response.
 * Start polling for changes if the job status is not completed.
 *
 * @param {Job} job
 */
export const handleResult = function* ( job ) {
	if ( ! job || ! job.id || job.deleted ) {
		return yield clearJob();
	}
	const { status, error } = job;
	yield setJob( job );

	if ( ! error && 'pending' === status.status ) {
		yield* schedule( update, 1000 );
	}
};
