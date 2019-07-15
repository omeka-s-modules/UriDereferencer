<?php
namespace UriDereferencer;

use Omeka\Module\AbstractModule;
use Zend\EventManager\Event;
use Zend\EventManager\SharedEventManagerInterface;

class Module extends AbstractModule
{
    public function getConfig()
    {
        return [
            'router' => [
                'routes' => [
                    'uri-dereferencer' => [
                        'type' => 'Segment',
                        'options' => [
                            'route' => '/uri-dereferencer',
                        ],
                    ],
                ],
            ],
        ];
    }

    public function attachListeners(SharedEventManagerInterface $sharedEventManager)
    {
        $sharedEventManager->attach(
            'Omeka\Controller\Site\Item',
            'view.show.before',
            function (Event $event) {
                $view = $event->getTarget();
                $view->headScript()->prependFile($view->assetUrl('js/uri-dereferencer.js', 'UriDereferencer'));
                $view->headScript()->appendFile($view->assetUrl('js/uri-dereferencer-services.js', 'UriDereferencer'));
                $view->headScript()->appendFile($view->assetUrl('js/uri-dereferencer-module.js', 'UriDereferencer'));
                $view->headScript()->appendScript(
                    sprintf(
                        'UriDereferencer.proxyEndpoint = "%s";',
                        $view->escapeJs($view->url('uri-dereferencer', [], ['query' => ['resource-url' => '']]))
                    )
                );
            }
        );
        $sharedEventManager->attach(
            '*',
            'route',
            function (Event $event) {
                $matchedRouteName = $event->getRouteMatch()->getMatchedRouteName();
                if ('uri-dereferencer' !== $matchedRouteName) {
                    return;
                }
                $resourceUrl = $event->getRequest()->getQuery()->get('resource-url');
                if (!$resourceUrl) {
                    throw new \Exception('No resource-url provided');
                }
                $client = $event->getApplication()->getServiceManager()->get('Omeka\HttpClient');
                echo $client->setUri($resourceUrl)->send()->getBody();
                exit;
            }
        );
    }
}
