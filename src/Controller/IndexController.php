<?php
namespace UriDereferencer\Controller;

use Laminas\Http\Client;
use Laminas\Http\Client\Adapter\Curl;
use Laminas\Mvc\Controller\AbstractActionController;

class IndexController extends AbstractActionController
{
    /**
     * @var Client
     */
    protected $client;

    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    /**
     * Proxy for URI Dereferencer requests.
     */
    public function proxyAction()
    {
        $response = $this->getResponse();
        $resourceUrl = $this->params()->fromQuery('resource-url');
        $adapter = $this->params()->fromQuery('adapter');
        $acceptHeader = $this->params()->fromQuery('accept-header');
        if ('' === trim($resourceUrl)) {
            return $response->setStatusCode('400')
                ->setContent('The query must include the resource-url parameter.');
        }
        if ('curl' === $adapter) {
            $this->client->setAdapter(Curl::class);
        }
        if ($acceptHeader) {
            $this->client->setHeaders(['Accept' => $acceptHeader]);
        }
        try {
            $serviceResponse = $this->client->setUri($resourceUrl)->send();
        } catch (\Exception $e) {
            return $response->setStatusCode(500)
                ->setContent(sprintf('Error during service request: %s', $e->getMessage()));
        }
        if (!$serviceResponse->isSuccess()) {
            return $response->setStatusCode($serviceResponse->getStatusCode())
                ->setContent((sprintf('Error during service request: %s', $serviceResponse->getReasonPhrase())));
        }
        return $response->setStatusCode($serviceResponse->getStatusCode())
            ->setContent($serviceResponse->getBody());
    }
}
