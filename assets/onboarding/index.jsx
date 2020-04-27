import { Stepper } from '@woocommerce/components';
import { render } from '@wordpress/element';
import { useFullScreen } from '../react-hooks';
import { steps } from './steps.jsx';

function SenseiOnboardingPage() {
	useFullScreen( [ 'sensei-color', 'sensei-onboarding__page' ] );

	const currentStep = steps[ 0 ];

	return (
		<>
			<div className="sensei-onboarding__header">
				<Stepper currentStep={ currentStep.key } steps={ steps } />
			</div>
			<div className="sensei-onboarding__container">
				{ currentStep.container }
			</div>
		</>
	);
}

render(
	<SenseiOnboardingPage />,
	document.getElementById( 'sensei-onboarding-page' )
);
