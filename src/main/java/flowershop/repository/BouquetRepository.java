package flowershop.repository;

import flowershop.entity.Bouquet;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BouquetRepository extends JpaRepository<Bouquet, Long> {

    @EntityGraph(attributePaths = {"flowers"})
    @Query("SELECT b FROM Bouquet b")
    List<Bouquet> findAllWithFlowers();
}