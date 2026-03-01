package flowershop.mapper;

import flowershop.dto.FlowerDto;
import flowershop.entity.Flower;

public class FlowerMapper {

    private FlowerMapper() {

    }

    public static FlowerDto toDto(Flower flower) {

        if (flower == null) {
            return null;
        }

        FlowerDto flowerDto = new FlowerDto();
        flowerDto.setId(flower.getId());
        flowerDto.setCatalogNumber(flower.getCatalogNumber());
        flowerDto.setName(flower.getName());
        flowerDto.setPrice(flower.getPrice());
        flowerDto.setColor(flower.getColor());

        return flowerDto;
    }

    public static Flower toEntity(FlowerDto dto) {
        if (dto == null) {
            return null;
        }

        Flower flower = new Flower();
        flower.setId(dto.getId());
        flower.setCatalogNumber(dto.getCatalogNumber());
        flower.setName(dto.getName());
        flower.setPrice(dto.getPrice());
        flower.setColor(dto.getColor());

        return flower;
    }
}


