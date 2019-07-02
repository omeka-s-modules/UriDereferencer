<?php
namespace LinkedDataDisplay;

use Omeka\Module\AbstractModule;
use Zend\EventManager\Event;
use Zend\EventManager\SharedEventManagerInterface;

class Module extends AbstractModule
{
    public function attachListeners(SharedEventManagerInterface $sharedEventManager)
    {
        $sharedEventManager->attach(
            'Omeka\Controller\Site\Item',
            'view.show.before',
            function (Event $event) {
                $view = $event->getTarget();
                $view->headScript()->appendFile($view->assetUrl('js/linked-data-display.js', 'LinkedDataDisplay'));
                $view->headScript()->appendFile($view->assetUrl('js/linked-data-display-services.js', 'LinkedDataDisplay'));
            }
        );
    }
}
