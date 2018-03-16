<?php

namespace JsonStreamingParser\Listener;

/**
 * This basic implementation of a listener simply constructs an in-memory
 * representation of the JSON document, which is a little silly since the whole
 * point of a streaming parser is to avoid doing just that. However, it can
 * serve as a starting point for more complex listeners, and illustrates some
 * useful concepts for working with a streaming-style parser.
 */
class InMemoryListener extends IdleListener
{
    protected $result;
    protected $stack;
    protected $keys;

    public function getJson()
    {
        return $this->result;
    }

    public function startDocument()
    {
        $this->stack = [];
        $this->keys = [];
    }

    public function startObject()
    {
        $this->startComplexValue('object');
    }

    public function endObject($conn, $userId)
    {
        $this->endComplexValue($conn, $userId);
    }

    public function startArray()
    {
        $this->startComplexValue('array');
    }

    public function endArray($conn, $userId)
    {
        $this->endComplexValue($conn, $userId);
    }

    public function key($key)
    {
        $this->keys[] = $key;
    }

    public function value($value)
    {
        $this->insertValue($value);
    }

    protected function startComplexValue($type)
    {
        // We keep a stack of complex values (i.e. arrays and objects) as we build them,
        // tagged with the type that they are so we know how to add new values.
        $current_item = ['type' => $type, 'value' => []];
        $this->stack[] = $current_item;
    }

    public function convertOfficialIdToInternalId($id)
    {
        switch ($id) {
        case 57: // Old tires
            $convertedId = 42;
            break;
        case 115: // Waste glass
            $convertedId = 51;
            break;
        case 70: // Scrap metal
            $convertedId = 45;
            break;
        case 74: // Used oil
            $convertedId = 50;
            break;
        case 32: case 33: // Aluminium
                $convertedId = 22;
            break;
        case 93: case 95: // Batteries
                $convertedId = 25;
            break;
        case 12: // Bauxite
            $convertedId = 8;
            break;
        case 7: case 6: // Concrete
                $convertedId = 15;
            break;
        case 120: // Drone wreckage
            $convertedId = 37;
            break;
        case 22: case 23: // Fertilizer
                $convertedId = 16;
            break;
        case 13: // Iron ore
            $convertedId = 4;
            break;
        case 66: case 69: // Electronics
                $convertedId = 28;
            break;
        case 78: // Electronic scrap
            $convertedId = 38;
            break;
        case 99: // Elite force
            $convertedId = 53;
            break;
        case 38: case 39: // Fossil fuel
                $convertedId = 18;
            break;
        case 41: // Fossils
            $convertedId = 39;
            break;
        case 103: // Gangster
            $convertedId = 54;
            break;
        case 60: case 61: // Glass
                $convertedId = 19;
            break;
        case 79:  case 80: // Gold
                $convertedId = 32;
            break;
        case 14: // Gold ore
              $convertedId = 12;
            break;
        case 49: // Ilmenite
            $convertedId = 10;
            break;
        case 28: case 29: // Insecticides
                $convertedId = 20;
            break;
        case 20: // Limestone
            $convertedId = 1;
            break;
        case 102: // Attack dogs
            $convertedId = 52;
            break;
        case 3: // Gravel
            $convertedId = 2;
            break;
        case 8: // Coal
            $convertedId = 3;
            break;
        case 58: case 63: // Plastics
                $convertedId = 23;
            break;
        case 77: // Plastic scrap
            $convertedId = 43;
            break;
        case 36: case 37: // Copper
                $convertedId = 21;
            break;
        case 26: // Chalcopyrite
            $convertedId = 7;
            break;
        case 55: // Copper coins
            $convertedId = 36;
            break;
        case 124: case 125: // Trucks
                $convertedId = 34;
            break;
        case 2: // Clay
            $convertedId = 0;
            break;
        case 92: case 91: // Lithium
                $convertedId = 24;
            break;
        case 90: // Lithium ore
            $convertedId = 9;
            break;
        case 75: case 76: // Medical technology
                $convertedId = 30;
            break;
        case 104: // Private army
            $convertedId = 55;
            break;
        case 53: // Quartz sand
            $convertedId = 6;
            break;
        case 42: // Giant diamond
            $convertedId = 40;
            break;
        case 81: // Rough diamonds
            $convertedId = 13;
            break;
        case 10: // Crude oil
            $convertedId = 5;
            break;
        case 40: // Roman coins
            $convertedId = 44;
            break;
        case 117: case 118: // Scan drones
                $convertedId = 35;
            break;
        case 84: case 85: // Jewellery
                $convertedId = 33;
            break;
        case 35: case 34: // Silver
                $convertedId = 31;
            break;
        case 15: // Silver ore
            $convertedId = 11;
            break;
        case 67: case 68: // Silicon
                $convertedId = 27;
            break;
        case 30: case 31: // Steel
                $convertedId = 17;
            break;
        case 44: // Tech upgrade 1
            $convertedId = 46;
            break;
        case 45: // Tech upgrade 2
            $convertedId = 47;
            break;
        case 46: // Tech upgrade 3
            $convertedId = 48;
            break;
        case 48: // Tech upgrade 4
            $convertedId = 49;
            break;
        case 51: case 52: // Titanium
                $convertedId = 29;
            break;
        case 96: // Watch dogs
            $convertedId = 57;
            break;
        case 98: // Security staff
            $convertedId = 56;
            break;
        case 87: case 101: // Weapons
                $convertedId = 26;
            break;
        case 43: // Maintenance kit
            $convertedId = 41;
            break;
        case 24: case 25: // Bricks
                $convertedId = 14;
            break;
        }

        return $convertedId;
    }

    protected function endComplexValue($conn, $userId)
    {
        $obj = array_pop($this->stack);

        // If the value stack is now empty, we're done parsing the document, so we can
        // move the result into place so that getJson() can return it. Otherwise, we
        // associate the value
        if (empty($this->stack)) {
            $this->result = $obj['value'];
        } else {
            //$this->insertValue($obj['value']);

            $query = "INSERT INTO `userMineMap_" .$userId. "` (
              `lon`, `lat`,
              `type`, `quality`, `builddate`,
              `fullRate`, `HQBoost`,
              `rawRate`, `techFactor`
              ) VALUES (
                " .$obj['value']['lon']. ", " .$obj['value']['lat']. ",
                " .$this->convertOfficialIdToInternalId($obj['value']['resourceID']). ", " .$obj['value']['quality']. ", " .$obj['value']['builddate']. ",
                " .$obj['value']['fullrate']. ",
                " .$obj['value']['HQboost']. ",
                " .$obj['value']['rawrate']. ",
                " .$obj['value']['techfactor']. "
              );";
            $conn->query($query);

        }
    }

    // Inserts the given value into the top value on the stack in the appropriate way,
    // based on whether that value is an array or an object.
    protected function insertValue($value)
    {
        // Grab the top item from the stack that we're currently parsing.
        $current_item = array_pop($this->stack);

        // Examine the current item, and then:
        //   - if it's an object, associate the newly-parsed value with the most recent key
        //   - if it's an array, push the newly-parsed value to the array
        if ($current_item['type'] === 'object') {
            $current_item['value'][array_pop($this->keys)] = $value;
        } else {
            $current_item['value'][] = $value;
        }

        // Replace the current item on the stack.
        $this->stack[] = $current_item;
    }
}
